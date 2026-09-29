import fs from 'node:fs'
import path from 'node:path'
import { CRITERIA } from '../rubric.mjs'

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

function scoreInventaris(ctx) {
  const evidence = []
  if (ctx.manifestFiles.length === 0) {
    const bullets = ctx.readmeContent ? (ctx.readmeContent.match(/^[-*]\s+.+$/gm) || []).length : 0
    if (bullets > 0) {
      evidence.push(`Geen manifestbestand; README bevat ${bullets} Markdown-opsommingsregel(s) als enige lijst.`)
      return { score: 1, evidence, oordeel: 'Een lijst bestaat alleen als vrije-tekst Markdown-opsomming, zonder vaste structuur.' }
    }
    evidence.push('Geen manifestbestand (ctx.manifestFiles is leeg) en geen opsomming in de README.')
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

function scoreTypeDefinities(ctx) {
  const evidence = []
  if (ctx.typeDeclarationFiles.length > 0) {
    const nonEmpty = ctx.typeDeclarationFiles.filter((f) => {
      const c = readFile(ctx, f)
      return c && c.trim().length > 0
    })
    evidence.push(`${ctx.typeDeclarationFiles.length} .d.ts-bestand(en) gevonden, waarvan ${nonEmpty.length} niet-leeg: ${ctx.typeDeclarationFiles.slice(0, 5).join(', ')}`)
    if (nonEmpty.length === ctx.typeDeclarationFiles.length) {
      return { score: 3, evidence, oordeel: 'Gebundelde .d.ts-declaraties zijn aanwezig en niet leeg, dus volledig machinaal te extraheren.' }
    }
    return { score: 2, evidence, oordeel: 'Type-declaraties zijn gebundeld, maar niet allemaal gevuld.' }
  }
  if (ctx.hasTypeScript) {
    evidence.push('TypeScript-broncode gedetecteerd, maar geen gebundelde .d.ts-declaratiebestanden.')
    return { score: 1, evidence, oordeel: 'Types bestaan impliciet in TS-broncode, maar zonder gebundelde declaraties is er niets machinaal te lezen.' }
  }
  evidence.push('Geen .ts/.tsx-bestanden, geen typescript-dependency en geen .d.ts-bestanden gevonden.')
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

function scoreNaamgeving(ctx) {
  const evidence = []
  const names = ctx.componentFiles.map(basenameNoExt)
  if (names.length === 0) {
    return { score: 0, evidence: ['Geen componentbestanden gevonden om een patroon op te toetsen.'], oordeel: 'Er is niets om een conventie op te toetsen.' }
  }
  const firstCharCounts = new Map()
  for (const n of names) firstCharCounts.set(n[0], (firstCharCounts.get(n[0]) || 0) + 1)
  const [dominantChar] = [...firstCharCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const prefixRegex = new RegExp(`^${dominantChar}[A-Z][A-Za-z0-9]*$`)
  const matched = names.filter((n) => prefixRegex.test(n))
  const matchRate = matched.length / names.length
  evidence.push(`${matched.length}/${names.length} (${Math.round(matchRate * 100)}%) componentbestanden matchen de simpele regex ^${dominantChar}[A-Z][A-Za-z0-9]*$.`)

  const lintFound = hasLintConfig(ctx)
  const lintScript = Boolean(ctx.packageJson?.scripts?.lint)
  evidence.push(lintFound ? 'Er is een ESLint-configuratiebestand gevonden.' : 'Geen ESLint- (of vergelijkbaar) configuratiebestand gevonden.')

  if (matchRate === 1 && lintFound && lintScript) {
    evidence.push(`package.json bevat een "lint"-script ("${ctx.packageJson.scripts.lint}").`)
    return { score: 3, evidence, oordeel: 'De conventie wordt afgedwongen door een lint-opzet die ook daadwerkelijk als script is aangesloten, dus 100% programmatisch te verifiëren.' }
  }
  if (matchRate === 1 && lintFound) {
    return { score: 2, evidence, oordeel: 'De conventie is grotendeels met eenvoudige regels/lint-configuratie te controleren, al is niet bevestigd dat die lint-config de naamgeving zelf afdwingt.' }
  }
  if (matchRate > 0) {
    evidence.push('Het patroon is niet gekoppeld aan een aantoonbaar afdwingende lint-regel of generator.')
    return { score: 1, evidence, oordeel: 'Een deel van de conventie (het prefix) is met een simpele regex te herkennen, maar wordt nergens automatisch afgedwongen.' }
  }
  return { score: 0, evidence, oordeel: 'Naamgeving is niet af te leiden zonder de conventie te kennen; geen regel is programmatisch te controleren.' }
}

function scoreDesignTokens(ctx) {
  const evidence = []
  if (ctx.designTokenFiles.length === 0) {
    const candidates = ctx.allFiles.filter((f) => /\.(css|vue)$/.test(f)).slice(0, 30)
    let scattered = 0
    for (const f of candidates) {
      const c = readFile(ctx, f)
      if (c && /--[\w-]+\s*:/.test(c)) scattered++
    }
    evidence.push(
      scattered > 0
        ? `Geen apart tokenbestand (ctx.designTokenFiles is leeg); CSS custom properties komen verspreid voor in minstens ${scattered}/${candidates.length} gesamplede bestanden.`
        : 'Geen apart tokenbestand en geen CSS custom properties gevonden in de gesamplede bestanden.'
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
    evidence.push('Geen git-geschiedenis beschikbaar (ctx.gitLog is null).')
    return { score: 0, evidence, oordeel: 'Geschiedenis is niet programmatisch te bevragen.' }
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
    const { score, evidence, oordeel } = scorer(ctx)
    return { criterionId: criterion.id, score, max: 3, evidence, oordeel }
  })
  return { dimensionId: 'machineleesbaarheid', rows }
}
