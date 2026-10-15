import fs from 'node:fs'
import path from 'node:path'
import { CRITERIA } from '../rubric.mjs'
import { isPascalCase } from './vue-utils.mjs'

function readFile(ctx, relPath) {
  try {
    return fs.readFileSync(path.join(ctx.rootDir, relPath), 'utf8')
  } catch {
    return null
  }
}

function tryJsonParse(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function basenameNoExt(relPath) {
  return path.basename(relPath).replace(/\.[^.]+$/, '')
}

function findStorybookMainFile(ctx) {
  return ctx.allFiles.find((f) => /(^|\/)\.storybook\/main\.(m?[jt]s|cjs)$/.test(f)) || null
}

function hasLintConfig(ctx) {
  return ctx.allFiles.some((f) => /(^|\/)(\.eslintrc(\.\w+)?|eslint\.config\.(m?[jt]s|cjs))$/.test(f))
}

// Category-file shape used by both inventaris and compositiepatroon: an object literal whose
// values are arrays, e.g. `Actions: ['SButton', ...]`. Counted via regex rather than import()
// so a malformed or even hostile target repo can never execute code during analysis.
function countGroupingKeys(raw) {
  return (raw.match(/^\s{2,}['"]?[\w -]+['"]?:\s*\[/gm) || []).length
}


// Share of components that have a story with the same file name, i.e. appear in the Storybook
// sidebar. Storybook builds its sidebar (and index.json) from the stories, so for a library that
// is documented in Storybook this IS the central inventory an AI reads via the MCP addon.
function storyCoverage(ctx) {
  const storyBases = new Set(ctx.storyFiles.map((s) => path.basename(s).replace(/\.(stories|story)\.(mdx|[jt]sx?)$/i, '')))
  const names = ctx.componentFiles.map((f) => path.basename(f).replace(/\.(vue|jsx|tsx)$/i, ''))
  const covered = names.filter((n) => storyBases.has(n))
  const missing = names.filter((n) => !storyBases.has(n))
  return { covered: covered.length, total: names.length, share: names.length ? covered.length / names.length : 0, missing }
}

function scoreInventaris(ctx) {
  const evidence = []
  if (ctx.manifestFiles.length === 0) {
    if (ctx.hasStorybook) {
      const cov = storyCoverage(ctx)
      const mainConfig = findStorybookMainFile(ctx)
      const mcpRegistered = mainConfig ? /addon-mcp/.test(readFile(ctx, mainConfig) || '') : false
      evidence.push(`Geen manifestbestand; Storybook genereert bij het bouwen een index.json met alle stories (${cov.covered}/${cov.total} componenten hebben een story).`)
      evidence.push(mcpRegistered ? `${mainConfig} registreert addon-mcp: de lijst is programmatisch op te vragen.` : 'addon-mcp is niet geregistreerd in de Storybook-configuratie.')
      evidence.push('Let op: index.json wordt gegenereerd en staat niet in de repository; de score gaat uit van een draaiende of gebouwde Storybook.')
      if (mcpRegistered && cov.share >= 0.9) {
        return { score: 3, evidence, oordeel: 'Het overzicht is via Storybook (index.json en addon-mcp) programmatisch in te lezen en vrijwel compleet.' }
      }
      if (cov.share >= 0.5) {
        return { score: 2, evidence, oordeel: 'Storybook levert een gestructureerde lijst, maar die is niet via een tool-integratie ontsloten of mist een deel van de componenten.' }
      }
    }
    const bullets = ctx.readmeContent ? (ctx.readmeContent.match(/^[-*]\s+.+$/gm) || []).length : 0
    if (bullets > 0) {
      evidence.push(`README bevat ${bullets} Markdown-opsommingsregel(s) als enige lijst.`)
      return { score: 1, evidence, oordeel: 'Een lijst bestaat alleen als vrije-tekst Markdown-opsomming, zonder vaste structuur.' }
    }
    evidence.push('Geen manifestbestand, geen dekkende Storybook en geen opsomming in de README.')
    return { score: 0, evidence, oordeel: 'Geen enkel bestand somt componenten machinaal op.' }
  }

  const manifest = ctx.manifestFiles[0]
  const ext = path.extname(manifest).toLowerCase()
  evidence.push(`Manifestbestand: ${manifest}`)

  if (ext === '.json') {
    const parsed = tryJsonParse(readFile(ctx, manifest))
    const size = parsed ? (Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length) : 0
    if (parsed && size > 0) {
      evidence.push(`${manifest} parseert als geldige, niet-lege JSON met ${size} top-level entries.`)
      return { score: 3, evidence, oordeel: 'Een gestructureerd JSON-bestand is programmatisch in te lezen en compleet.' }
    }
    evidence.push(`${manifest} parseert niet als geldige, niet-lege JSON.`)
    return { score: 1, evidence, oordeel: 'Het manifest bestaat, maar is niet betrouwbaar als gestructureerde data te parsen.' }
  }

  if (['.js', '.mjs', '.ts'].includes(ext)) {
    const raw = readFile(ctx, manifest) || ''
    const looksStructured = /export\s+(const|default)\s+\w*\s*=?\s*[{[]/.test(raw)
    const stringEntries = (raw.match(/['"][^'"]{1,60}['"]/g) || []).length
    const groupingKeys = countGroupingKeys(raw)
    if (looksStructured) {
      evidence.push(`${manifest} bevat een 'export const/default ... = {'-patroon (regex-detectie, geen import() uitgevoerd).`)
      evidence.push(`${manifest} bevat ~${stringEntries} string-literalen en ${groupingKeys} categorie-achtige sleutel(s) die naar een array wijzen.`)
      return { score: 3, evidence, oordeel: 'Het manifest is een echt gestructureerd JS-object (geen vrije tekst) en dus volledig programmatisch inleesbaar.' }
    }
    evidence.push(`${manifest} matcht geen herkenbaar geëxporteerd object/array-patroon.`)
    return { score: 1, evidence, oordeel: 'Er is een kandidaat-manifestbestand, maar geen herkenbare geëxporteerde datastructuur.' }
  }

  evidence.push(`${manifest} heeft een extensie (${ext || 'onbekend'}) die niet als gestructureerde data te parsen is.`)
  return { score: 1, evidence, oordeel: 'Er is een manifestbestand, maar het formaat is niet zonder meer machinaal te parsen.' }
}

function scoreApiDocumentatie(ctx) {
  const evidence = []
  const sample = ctx.componentFiles
  let jsDocHits = 0
  let structuredPropsHits = 0
  for (const f of sample) {
    const content = readFile(ctx, f)
    if (!content) continue
    if (/@(param|prop|property|event|slot)\b/.test(content)) jsDocHits++
    if (/defineProps\s*\(\s*\{|defineProps\s*<[^>]+>\s*\(|props\s*:\s*\{|PropTypes\./.test(content)) structuredPropsHits++
  }
  const n = sample.length || 1
  const jsDocRatio = jsDocHits / n
  const structuredPropsRatio = structuredPropsHits / n

  const mainConfig = findStorybookMainFile(ctx)
  const mainConfigContent = mainConfig ? readFile(ctx, mainConfig) : null
  const hasDocsTool = Boolean(mainConfigContent && /addon-docs|addon-mcp/.test(mainConfigContent))

  evidence.push(`${jsDocHits}/${sample.length} componentbestanden bevatten JSDoc-tags (@param/@prop/@event/@slot).`)
  evidence.push(`${structuredPropsHits}/${sample.length} componentbestanden declareren props/types via een gestructureerde vorm (bv. defineProps({...})).`)
  if (mainConfig) evidence.push(`${mainConfig} ${hasDocsTool ? 'registreert' : 'registreert geen'} een docs-genererende Storybook-addon.`)

  if (ctx.hasTypeScript && ctx.typeDeclarationFiles.length > 0 && jsDocRatio > 0.3) {
    return { score: 3, evidence, oordeel: 'Types plus JSDoc-tags maken de API-documentatie volledig af te leiden zonder tekst te parsen.' }
  }
  if (hasDocsTool && structuredPropsRatio > 0.5) {
    return { score: 2, evidence, oordeel: 'Een docs-tool kan het grootste deel van de props/events afleiden uit gestructureerde declaraties, maar zonder types of JSDoc ontbreekt de betekenis per prop en zijn slots niet formeel gedeclareerd.' }
  }
  if (jsDocRatio > 0 || structuredPropsRatio > 0) {
    return { score: 1, evidence, oordeel: 'Een deel van de API is uit code af te leiden, maar niet consistent gestructureerd en niet gedekt door een docs-tool.' }
  }
  evidence.push(ctx.readmeContent ? 'Alleen de README bevat mogelijk prop-uitleg, als vrije tekst.' : 'Geen enkele bron van API-documentatie gevonden.')
  return { score: 0, evidence, oordeel: 'Documentatie bestaat, voor zover aanwezig, alleen als losse tekst.' }
}

// Does the build generate declaration files from the source (vue-tsc/tsc with declarations,
// vite-plugin-dts)? Then they exist in the published package, even if not in the repository.
function declarationGeneration(ctx) {
  const scripts = Object.values(ctx.packageJson?.scripts || {}).join(' ')
  const deps = { ...(ctx.packageJson?.dependencies || {}), ...(ctx.packageJson?.devDependencies || {}) }
  const byScript = /vue-tsc[^&|;]*--(emitDeclarationOnly|declaration)|\btsc\b[^&|;]*--(emitDeclarationOnly|declaration)/.test(scripts)
  const byPlugin = Boolean(deps['vite-plugin-dts'] || deps['rollup-plugin-dts'])
  return { generated: byScript || byPlugin, byScript, byPlugin, typesField: ctx.packageJson?.types || ctx.packageJson?.typings || null }
}

function scoreTypeDefinities(ctx) {
  const evidence = []
  const gen = declarationGeneration(ctx)
  if (ctx.ambientDeclarationFiles?.length) evidence.push(`Niet meegeteld (omgevings-/moduledeclaraties, geen component-API): ${ctx.ambientDeclarationFiles.join(', ')}.`)
  if (ctx.typeDeclarationFiles.length > 0) {
    evidence.push(`${ctx.typeDeclarationFiles.length} .d.ts-bestand(en) met component-API in de repository: ${ctx.typeDeclarationFiles.slice(0, 5).join(', ')}`)
    return { score: 3, evidence, oordeel: 'Gebundelde declaraties van de component-API staan in de repository en zijn volledig machinaal te extraheren.' }
  }
  if (gen.generated) {
    evidence.push(gen.byScript ? 'Een buildscript genereert declaratiebestanden (vue-tsc/tsc met --emitDeclarationOnly of --declaration).' : 'Een declaratie-plugin (vite-plugin-dts/rollup-plugin-dts) staat in de dependencies.')
    evidence.push(gen.typesField ? `package.json "types" wijst naar ${gen.typesField}.` : 'package.json heeft geen "types"-veld.')
    evidence.push('De gegenereerde bestanden staan niet in de repository; of ze de hele publieke API dekken, is zonder build niet te controleren.')
    return { score: 2, evidence, oordeel: 'Type-declaraties worden bij het bouwen gegenereerd; volledige dekking van de publieke API is statisch niet te bevestigen.' }
  }
  if (ctx.hasTypeScript) {
    evidence.push('TypeScript-broncode gedetecteerd, maar geen declaraties in de repository en geen generatie in de build.')
    return { score: 1, evidence, oordeel: 'Types bestaan in de TS-broncode, maar zonder gebundelde declaraties is er niets los machinaal te lezen.' }
  }
  evidence.push('Geen TypeScript en geen .d.ts-bestanden gevonden.')
  return { score: 0, evidence, oordeel: 'Geen enkel type is machinaal te extraheren.' }
}

function scoreVoorbeelden(ctx) {
  const evidence = []
  if (ctx.storyFiles.length === 0) {
    const codeBlocks = ctx.readmeContent ? Math.floor((ctx.readmeContent.match(/```/g) || []).length / 2) : 0
    if (codeBlocks > 0) {
      evidence.push(`Geen story-bestanden; README bevat ${codeBlocks} code-blok(ken) als enige voorbeelden.`)
      return { score: 1, evidence, oordeel: 'Voorbeelden staan als code, maar niet als apart, query-baar bestand per component.' }
    }
    evidence.push('Geen story-bestanden en geen codevoorbeelden in de README.')
    return { score: 0, evidence, oordeel: 'Voorbeelden bestaan, voor zover aanwezig, alleen als prosatekst.' }
  }

  const componentBase = new Set(ctx.componentFiles.map(basenameNoExt))
  let paired = 0
  for (const s of ctx.storyFiles) {
    const base = path.basename(s).replace(/\.(stories|story)\.[jt]sx?$/i, '').replace(/\.(stories|story)\.mdx$/i, '')
    if (componentBase.has(base)) paired++
  }
  const pairRatio = paired / ctx.storyFiles.length
  evidence.push(`${ctx.storyFiles.length} story-bestand(en); ${paired} (${Math.round(pairRatio * 100)}%) delen exact de bestandsnaam van een componentbestand (bv. ${ctx.storyFiles[0]}).`)
  evidence.push(`hasStorybook=${ctx.hasStorybook} — Storybook is (indien true) de tool om deze bestanden per component op te vragen.`)

  if (pairRatio >= 0.7) {
    return { score: 3, evidence, oordeel: 'Voorbeelden staan in gestructureerde, per-component query-bare story-bestanden met Storybook als opvraagtool.' }
  }
  return { score: 2, evidence, oordeel: 'Voorbeeldbestanden zijn programmatisch vindbaar, maar onvoldoende betrouwbaar aan hun component te koppelen.' }
}

function lintNamingRules(ctx) {
  const configs = ctx.allFiles.filter((f) => /(^|\/)(\.eslintrc(\.\w+)?|eslint\.config\.(m?[jt]s|cjs))$/.test(f))
  const namingRuleRe = /prop-name-casing|component-name-in-template-casing|component-definition-name-casing|multi-word-component-names|naming-convention|vue3-strongly-recommended|vue3-recommended|plugin:vue\/(strongly-)?recommended/
  const withRules = configs.filter((f) => namingRuleRe.test(readFile(ctx, f) || ''))
  return { configs, withRules }
}

function scoreNaamgeving(ctx) {
  const evidence = []
  const names = ctx.componentFiles.map(basenameNoExt)
  if (names.length === 0) {
    return { score: 0, evidence: ['Geen componentbestanden gevonden om een patroon op te toetsen.'], oordeel: 'Er is niets om een conventie op te toetsen.' }
  }
  const pascal = names.filter(isPascalCase)
  const pascalRate = pascal.length / names.length
  evidence.push(`${pascal.length}/${names.length} (${Math.round(pascalRate * 100)}%) componentbestanden voldoen aan de PascalCase-regel ^[A-Z][A-Za-z0-9]*$.`)

  const { configs, withRules } = lintNamingRules(ctx)
  const lintRuns = Object.values(ctx.packageJson?.scripts || {}).some((s) => /\beslint\b/.test(s))
  evidence.push(configs.length ? `ESLint-configuratie gevonden: ${configs.join(', ')}.` : 'Geen ESLint-configuratiebestand gevonden.')
  evidence.push(withRules.length ? `Naamgevingsregels (of een eslint-plugin-vue-preset die ze bevat) in: ${withRules.join(', ')}.` : 'Geen naamgevingsregels gevonden in de ESLint-configuratie.')
  evidence.push(lintRuns ? 'Een npm-script voert ESLint uit.' : 'Geen npm-script dat ESLint uitvoert.')

  if (withRules.length && lintRuns && pascalRate >= 0.95) {
    return { score: 3, evidence, oordeel: 'De naamgeving wordt afgedwongen door lint-regels die ook daadwerkelijk via een script draaien.' }
  }
  if (pascalRate >= 0.95) {
    return { score: 2, evidence, oordeel: 'De conventie is met eenvoudige regels te controleren (PascalCase voor componenten), maar wordt niet aantoonbaar door een lint-regel afgedwongen.' }
  }
  if (pascalRate > 0) {
    return { score: 1, evidence, oordeel: 'Een deel van de conventie is met een simpele regel te herkennen, maar niet voor alle componenten.' }
  }
  return { score: 0, evidence, oordeel: 'Naamgeving is niet af te leiden zonder de conventie te kennen; geen regel is programmatisch te controleren.' }
}

function scoreDesignTokens(ctx) {
  const evidence = []
  if (ctx.designTokenFiles.length === 0) {
    const candidates = ctx.allFiles.filter((f) => /\.(css|vue)$/.test(f))
    let scattered = 0
    for (const f of candidates) {
      const c = readFile(ctx, f)
      if (c && /--[\w-]+\s*:/.test(c)) scattered++
    }
    evidence.push(
      scattered > 0
        ? `Geen apart tokenbestand (ctx.designTokenFiles is leeg); CSS custom properties komen verspreid voor in minstens ${scattered}/${candidates.length} onderzochte bestanden.`
        : 'Geen apart tokenbestand en geen CSS custom properties gevonden in de onderzochte bestanden.'
    )
    return { score: 0, evidence, oordeel: 'Tokens staan, als ze al bestaan, verspreid in CSS zonder gestructureerd brondocument.' }
  }

  let bestScore = 1
  for (const f of ctx.designTokenFiles) {
    const ext = path.extname(f).toLowerCase()
    const raw = readFile(ctx, f) || ''
    if (ext === '.json') {
      const parsed = tryJsonParse(raw)
      if (parsed && Object.keys(parsed).length > 0) {
        evidence.push(`${f} parseert als geldige, niet-lege JSON.`)
        bestScore = Math.max(bestScore, 3)
      } else {
        evidence.push(`${f} kon niet als geldige JSON geparsed worden.`)
      }
      continue
    }
    if (['.js', '.mjs', '.ts'].includes(ext)) {
      const structured = /export\s+(const|default)\s+\w*\s*=?\s*\{/.test(raw)
      evidence.push(`${f}: ${structured ? 'bevat' : 'bevat geen'} herkenbaar 'export ... = {'-patroon.`)
      bestScore = Math.max(bestScore, structured ? 3 : 1)
      continue
    }
    evidence.push(`${f} is een YAML-tokenbestand; formaat is gestructureerd van aard, inhoud is niet inhoudelijk geparsed (geen YAML-parser beschikbaar).`)
    bestScore = Math.max(bestScore, 2)
  }

  const oordeelByScore = {
    3: 'Een compleet, gestructureerd tokenbestand (JSON/JS) is machinaal in te lezen.',
    2: 'Een tokenbestand in een gestructureerd formaat bestaat, maar de inhoud is niet volledig geverifieerd.',
    1: 'Er is een kandidaat-tokenbestand, maar het parseert niet betrouwbaar als gestructureerde data.'
  }
  return { score: bestScore, evidence, oordeel: oordeelByScore[bestScore] }
}

function scoreCompositiepatroon(ctx) {
  const evidence = []
  const manifest = ctx.manifestFiles[0] || null
  if (!manifest) {
    const mentions = Boolean(ctx.readmeContent && /(slot|compos|layout.?primitive)/i.test(ctx.readmeContent))
    if (mentions) {
      evidence.push('README noemt compositie/slots/layout-primitieven in tekst, maar er is geen apart op te vragen bestand.')
      return { score: 1, evidence, oordeel: 'Het compositiepatroon is benoemd in tekst, maar niet als een op te vragen lijst van bouwstenen.' }
    }
    evidence.push('Geen manifest-/categoriebestand en geen vermelding van een compositiepatroon in de README.')
    return { score: 0, evidence, oordeel: 'Het compositiepatroon is alleen te begrijpen door voorbeeldcode te lezen; nergens benoemd.' }
  }

  const raw = readFile(ctx, manifest) || ''
  const groupingKeys = countGroupingKeys(raw)
  evidence.push(`${manifest} bevat ${groupingKeys} categorie-achtige sleutel(s) die elk naar een array van bouwstenen wijzen.`)

  if (groupingKeys === 0) {
    evidence.push(`${manifest} bevat geen herkenbare categorie-groepering.`)
    return { score: 1, evidence, oordeel: 'Er is een bestand, maar het codeert geen op te vragen lijst van bouwstenen.' }
  }

  const relationHints = /(composesWith|slots?\s*:|children\s*:|parent\s*:|relations?\s*:)/i.test(raw)
  if (relationHints) {
    evidence.push(`${manifest} bevat daarnaast een veld dat op onderlinge samenhang tussen bouwstenen wijst.`)
    return { score: 3, evidence, oordeel: 'Zowel de bouwstenen als hun onderlinge samenhang zijn machinaal op te vragen.' }
  }
  return { score: 2, evidence, oordeel: 'De bouwstenen zijn op te vragen via het categoriebestand, maar hun onderlinge relatie is er niet in gecodeerd.' }
}

function scoreVerouderdeComponenten(ctx) {
  const { marked } = ctx.deprecations
  if (marked.length === 0) {
    return { score: 0, evidence: ['Geen markeringen van verouderde componenten gevonden.'], oordeel: 'Er zijn geen markeringen om te lezen.' }
  }
  const jsdoc = marked.filter((d) => d.form === '@deprecated').length
  const share = jsdoc / marked.length
  const evidence = [`${jsdoc} van de ${marked.length} markeringen gebruiken de JSDoc-tag @deprecated, die editors en tools herkennen; de rest is vrije tekst.`]
  if (share >= 0.95) return { score: 3, evidence, oordeel: 'Alle markeringen gebruiken @deprecated en zijn zonder interpretatie door tools te herkennen.' }
  if (share > 0) return { score: 2, evidence, oordeel: 'Een deel van de markeringen gebruikt @deprecated; de rest moet als vrije tekst geïnterpreteerd worden.' }
  return { score: 1, evidence, oordeel: 'Markeringen staan alleen als vrije tekst in commentaar; een tool moet ze interpreteren.' }
}

function scoreVersiebeheer(ctx) {
  const evidence = []
  const version = ctx.packageJson?.version
  if (!version) {
    evidence.push('Geen package.json of geen version-veld gevonden.')
    return { score: 0, evidence, oordeel: 'Geen enkel gestructureerd bestand bevat versie-informatie.' }
  }
  evidence.push(`package.json version: "${version}" (structureel, direct parsebaar).`)

  if (!ctx.changelogFile) {
    evidence.push('Geen CHANGELOG-bestand gevonden (ctx.changelogFile is null).')
    return { score: 1, evidence, oordeel: 'Het versienummer is machinaal leesbaar via package.json, maar er is geen changelog om te parsen.' }
  }

  const content = ctx.changelogContent || ''
  const versionHeadings = content.match(/^##\s*\[?\d+\.\d+\.\d+\]?/gm) || []
  const allHeadings = content.match(/^##\s+.+$/gm) || []
  const ratio = allHeadings.length ? versionHeadings.length / allHeadings.length : 0
  evidence.push(`${ctx.changelogFile}: ${versionHeadings.length}/${allHeadings.length} '##'-kopjes volgen een '[x.y.z]'-patroon.`)

  if (allHeadings.length > 0 && ratio >= 0.9) {
    return { score: 3, evidence, oordeel: 'Versie en changelog zijn beide machinaal te parsen dankzij consequente versie-kopjes.' }
  }
  if (versionHeadings.length > 0) {
    return { score: 2, evidence, oordeel: 'De changelog volgt een herkenbaar, maar niet volledig afdwingbaar format.' }
  }
  return { score: 1, evidence, oordeel: 'Het versienummer is structureel via package.json, maar de changelog is vrije tekst zonder vaste structuur.' }
}

function scoreToolingIntegratie(ctx) {
  const evidence = []
  const signals = []

  for (const f of ctx.mcpConfigFiles) {
    const parsed = tryJsonParse(readFile(ctx, f))
    if (parsed && parsed.mcpServers && typeof parsed.mcpServers === 'object') {
      evidence.push(`${f} parseert als geldige JSON met een 'mcpServers'-sleutel.`)
      signals.push(3)
    } else {
      evidence.push(`${f} gevonden, maar parseert niet als geldig MCP-configbestand.`)
      signals.push(1)
    }
  }

  const structuredManifests = ctx.manifestFiles.filter((f) => /web-types\.json|custom-elements\.json/i.test(f))
  for (const f of structuredManifests) {
    if (tryJsonParse(readFile(ctx, f))) {
      evidence.push(`${f} is een standaard IDE-manifest (web-types/custom-elements) en parseert als geldige JSON.`)
      signals.push(3)
    }
  }

  const mainConfig = findStorybookMainFile(ctx)
  if (mainConfig) {
    const content = readFile(ctx, mainConfig) || ''
    const hasMcpAddon = /addon-mcp/.test(content)
    const hasDocsAddon = /addon-docs/.test(content)
    const addonList = [hasMcpAddon && 'addon-mcp', hasDocsAddon && 'addon-docs'].filter(Boolean).join(', ')
    evidence.push(`${mainConfig} registreert addons: ${addonList || 'geen relevante'}.`)
    if (hasMcpAddon) signals.push(3)
    else if (hasDocsAddon) signals.push(2)
  }

  if (signals.length === 0) {
    evidence.push('Geen .mcp.json, geen web-types.json/custom-elements.json, en geen Storybook MCP/docs-addon gevonden.')
    return { score: 0, evidence, oordeel: 'Geen van de integraties levert gestructureerde data; alles moet uit tekst worden afgeleid.' }
  }

  const bestScore = Math.max(...signals)
  const oordeelByScore = {
    1: 'Er is een integratie-kandidaat, maar die levert geen betrouwbaar gestructureerde data.',
    2: 'Eén integratie levert gestructureerde, programmatisch bevraagbare data.',
    3: 'Een volwaardig protocol (bv. MCP) of standaardschema ontsluit de API programmatisch, inclusief voorbeelden.'
  }
  return { score: bestScore, evidence, oordeel: oordeelByScore[bestScore] }
}

function scoreBroncodeToegankelijkheid(ctx) {
  const evidence = []
  const pkg = ctx.packageJson
  if (!pkg) {
    return { score: 0, evidence: ['Geen package.json gevonden.'], oordeel: 'Pakketmetadata (exports, entry points) ontbreekt.' }
  }
  const hasMain = Boolean(pkg.main)
  const hasModule = Boolean(pkg.module)
  const hasExports = Boolean(pkg.exports && typeof pkg.exports === 'object')
  const hasTypes = Boolean(pkg.types || pkg.typings)
  evidence.push(`main=${hasMain ? pkg.main : 'ontbreekt'}, module=${hasModule ? pkg.module : 'ontbreekt'}, exports=${hasExports ? 'aanwezig' : 'ontbreekt'}, types=${hasTypes ? pkg.types || pkg.typings : 'ontbreekt'}.`)

  if (!hasMain && !hasExports) {
    return { score: 0, evidence, oordeel: 'Pakketmetadata (exports, entry points) ontbreekt of is onvolledig.' }
  }
  if (hasExports) {
    const exportKeys = Object.keys(pkg.exports)
    evidence.push(`exports-map bevat ${exportKeys.length} entry/entries: ${exportKeys.join(', ')}.`)
    const rootExport = pkg.exports['.']
    const hasConditions = Boolean(rootExport && typeof rootExport === 'object' && ('import' in rootExport || 'require' in rootExport))
    if (hasConditions && (hasModule || hasTypes || exportKeys.length > 1)) {
      return { score: 3, evidence, oordeel: 'Een volledige exports-map met conditionele entries maakt de broncode direct door elke gangbare tool te verwerken.' }
    }
    return { score: 2, evidence, oordeel: 'Metadata is grotendeels compleet en door standaardtools te lezen, maar mist condities/aanvullende velden voor de hoogste score.' }
  }
  if (hasMain && hasModule) {
    return { score: 2, evidence, oordeel: 'Basismetadata (main + module) is aanwezig en door standaardtools te lezen, maar mist een volledig exports-veld.' }
  }
  return { score: 1, evidence, oordeel: 'Basismetadata (main) is aanwezig, maar mist een volledig exports-veld of vergelijkbaar.' }
}

function scoreTestdekking(ctx) {
  const evidence = []
  const deps = { ...(ctx.packageJson?.dependencies || {}), ...(ctx.packageJson?.devDependencies || {}) }
  const runners = ['vitest', 'jest', 'playwright', '@playwright/test', '@storybook/addon-vitest'].filter((d) => deps[d])
  const testScript = ctx.packageJson?.scripts?.test
  evidence.push(runners.length ? `Test-runner devDependencies gevonden: ${runners.join(', ')}.` : 'Geen test-runner devDependency gevonden.')
  evidence.push(testScript ? `package.json scripts.test = "${testScript}".` : 'Geen "test"-script in package.json.')
  evidence.push(`${ctx.testFiles.length} testbestand(en) gevonden (*.test.*/*.spec.*).`)

  if (ctx.testFiles.length === 0) {
    evidence.push('DevDependencies alleen zijn een zwak, indirect signaal — zonder testbestanden of testscript is er niets om resultaten uit op te vragen.')
    return { score: 0, evidence, oordeel: 'Testresultaten zijn niet programmatisch op te vragen, want er draaien geen tests.' }
  }
  const jsonCapableRunner = runners.some((r) => ['vitest', 'jest', 'playwright', '@playwright/test'].includes(r))
  if (jsonCapableRunner) {
    return { score: 2, evidence, oordeel: 'Testbestanden bestaan en de gebruikte runner ondersteunt gestructureerde/JSON-reporters per bestand; per-component opvraagbaarheid is statisch echter niet te bevestigen (zwakke inferentie).' }
  }
  return { score: 1, evidence, oordeel: 'Tests bestaan, maar zonder herkenbare runner met structured-reporter blijven resultaten vermoedelijk een algeheel pass/fail-log.' }
}

function scoreOnderhoudsactiviteit(ctx) {
  const evidence = []
  if (!ctx.gitLog) {
    evidence.push('Geen git-geschiedenis in de geanalyseerde map (ctx.gitLog is null).')
    return { nvt: true, score: 0, evidence, oordeel: 'Zonder git-geschiedenis is niet te meten of die programmatisch te bevragen is.' }
  }
  const messages = ctx.gitLog.recentMessagesSample || []
  const conventionalRe = /^(feat|fix|chore|docs|refactor|test|style|perf|build|ci)(\([\w-]+\))?!?:\s/i
  const matches = messages.filter((m) => conventionalRe.test(m))
  const ratio = messages.length ? matches.length / messages.length : 0
  evidence.push(`Git-geschiedenis is programmatisch bevraagd (${ctx.gitLog.totalCommits ?? '?'} commits totaal, ${messages.length} berichten gesampled).`)
  evidence.push(`${matches.length}/${messages.length} gesamplede commit-berichten volgen een 'type: onderwerp'-conventie; voorbeeld: "${messages[0] || ''}".`)

  const commitlintConfig = ctx.allFiles.some((f) => /commitlint\.config\.|\.commitlintrc/.test(f))
  if (ratio >= 0.9 && commitlintConfig) {
    evidence.push('Er is bovendien een commitlint-configuratie gevonden die dit format afdwingt.')
    return { score: 3, evidence, oordeel: 'Geschiedenis is volledig bevraagbaar met gestructureerde, aantoonbaar afgedwongen commit-berichten.' }
  }
  if (ratio >= 0.5) {
    return { score: 2, evidence, oordeel: 'Commit-berichten volgen grotendeels een herkenbaar format (bv. conventional commits).' }
  }
  evidence.push('De meeste gesamplede berichten zijn vrije tekst zonder vast format.')
  return { score: 1, evidence, oordeel: 'Geschiedenis is technisch bevraagbaar via git, maar de commit-berichten zelf zijn ongestructureerd.' }
}

const SCORERS = {
  inventaris: scoreInventaris,
  'api-documentatie': scoreApiDocumentatie,
  'type-definities': scoreTypeDefinities,
  voorbeelden: scoreVoorbeelden,
  naamgeving: scoreNaamgeving,
  'design-tokens': scoreDesignTokens,
  compositiepatroon: scoreCompositiepatroon,
  'verouderde-componenten': scoreVerouderdeComponenten,
  versiebeheer: scoreVersiebeheer,
  'tooling-integratie': scoreToolingIntegratie,
  'broncode-toegankelijkheid': scoreBroncodeToegankelijkheid,
  testdekking: scoreTestdekking,
  onderhoudsactiviteit: scoreOnderhoudsactiviteit
}

export function analyze(ctx) {
  const rows = CRITERIA.map((criterion) => {
    const scorer = SCORERS[criterion.id]
    if (!scorer) throw new Error(`Geen machineleesbaarheid-scorer voor criterion "${criterion.id}"`)
    const { score, evidence, oordeel, nvt } = scorer(ctx)
    return { criterionId: criterion.id, score, max: 3, evidence, oordeel, nvt: Boolean(nvt) }
  })
  return { dimensionId: 'machineleesbaarheid', rows }
}
