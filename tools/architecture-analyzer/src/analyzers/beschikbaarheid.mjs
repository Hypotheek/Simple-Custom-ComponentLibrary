import fs from 'node:fs'
import path from 'node:path'
import { CRITERIA } from '../rubric.mjs'

// Availability only asks whether an aspect is present and findable at all -- consistency,
// machine-readability and freshness are the sibling dimensions' job, not this one's.

function safeRead(ctx, rel) {
  try {
    return fs.readFileSync(path.join(ctx.rootDir, rel), 'utf8')
  } catch {
    return null
  }
}

function row(criterionId, score, evidence, oordeel) {
  return { criterionId, score: Math.max(0, Math.min(3, Math.round(score))), evidence, oordeel }
}

function analyzeInventaris(ctx) {
  const evidence = []
  if (ctx.manifestFiles.length > 0) {
    evidence.push(`manifestbestand(en) gevonden: ${ctx.manifestFiles.join(', ')}`)
    return row('inventaris', 3, evidence,
      'Eén centraal, machinaal leesbaar overzicht (manifest-/categoriebestand) somt de componenten op, direct vindbaar.')
  }
  if (ctx.hasStorybook) {
    evidence.push('geen manifestbestand, maar Storybook is aanwezig (sidebar toont componentenlijst)')
  }
  const readme = ctx.readmeContent || ''
  const hasComponentsHeading = /#+\s*(components?|componenten)/i.test(readme)
  if (hasComponentsHeading) {
    evidence.push(`${ctx.readmeFile} bevat een "componenten"-sectie`)
    const mentionsCount = (readme.match(/\bS[A-Z][a-zA-Z]+\b/g) || new Set()).length
    const looksComplete = ctx.componentCount > 0 && mentionsCount >= ctx.componentCount * 0.6
    evidence.push(`componentbestanden in repo: ${ctx.componentCount}, componentnamen genoemd in README: ~${mentionsCount}`)
    return row('inventaris', looksComplete ? 2 : 1, evidence,
      looksComplete
        ? 'Een lijst van vrijwel alle componenten is te vinden in de README, maar niet als apart gestructureerd bestand.'
        : 'Slechts een gedeeltelijke lijst is te vinden (bv. een stuk van de README); niet alle componenten staan erin.')
  }
  evidence.push('geen manifestbestand en geen componenten-overzicht in de README gevonden')
  evidence.push(`enige signaal is de broncode zelf (${ctx.componentCount} componentbestanden)`)
  return row('inventaris', 0, evidence,
    'Geen enkele plek somt de componenten op; ze zijn alleen te achterhalen door de broncode handmatig te doorzoeken.')
}

function analyzeApiDocumentatie(ctx) {
  const evidence = []
  const devDeps = { ...(ctx.packageJson?.dependencies || {}), ...(ctx.packageJson?.devDependencies || {}) }
  const hasDocsAddon = Object.keys(devDeps).some((d) => d.includes('storybook') && d.includes('docs'))
  if (hasDocsAddon) evidence.push('@storybook/addon-docs (of vergelijkbaar) staat in de dependencies')

  const jsdocRe = /\/\*\*[\s\S]*?\*\//
  const propsRe = /\b(props|defineProps|PropTypes|@prop|@param)\b/i
  const autodocsRe = /autodocs/

  const componentSample = ctx.componentFiles.slice(0, 15)
  let documented = 0
  let withJsdoc = 0
  let withAutodocsStory = 0
  for (const rel of componentSample) {
    const content = safeRead(ctx, rel)
    const hasJsdoc = content !== null && jsdocRe.test(content) && propsRe.test(content)
    if (hasJsdoc) withJsdoc++

    const base = path.basename(rel).replace(/\.(vue|jsx|tsx)$/, '')
    const storyRel = ctx.storyFiles.find((s) => path.basename(s).startsWith(base + '.'))
    const storyContent = storyRel ? safeRead(ctx, storyRel) : null
    const hasAutodocs = storyContent !== null && autodocsRe.test(storyContent)
    if (hasAutodocs) withAutodocsStory++

    if (hasJsdoc || hasAutodocs) documented++
  }
  const sampleSize = componentSample.length
  evidence.push(`${withAutodocsStory}/${sampleSize} gesamplede componenten hebben een story met 'autodocs'-tag`)
  evidence.push(`${withJsdoc}/${sampleSize} gesamplede componentbestanden bevatten JSDoc-achtige commentaarblokken bij props`)

  const ratio = sampleSize > 0 ? documented / sampleSize : 0
  if (sampleSize === 0) {
    return row('api-documentatie', 0, evidence, 'Geen componentbestanden beschikbaar om te samplen; documentatie is niet vastgesteld.')
  }
  if (documented === 0) {
    return row('api-documentatie', 0, evidence,
      'Geen documentatie aangetroffen; props zijn alleen af te leiden uit de component-broncode zelf.')
  }
  if (ratio < 0.5) {
    return row('api-documentatie', 1, evidence, 'Documentatie is aanwezig voor een minderheid van de gesamplede componenten.')
  }
  if (ratio < 0.9) {
    return row('api-documentatie', 2, evidence, 'Documentatie is aanwezig voor de meeste gesamplede componenten, met hiaten.')
  }
  evidence.push('let op: autodocs leidt props automatisch af uit de runtime-declaratie, maar documenteert lang niet altijd expliciet events/slots met betekenis')
  return row('api-documentatie', 3, evidence, 'Documentatie (grotendeels automatisch via Storybook autodocs) is aanwezig voor vrijwel elk gesampled component.')
}

function analyzeTypeDefinities(ctx) {
  const evidence = [`hasTypeScript: ${ctx.hasTypeScript}`, `typeDeclarationFiles: ${ctx.typeDeclarationFiles.length}`]
  if (!ctx.hasTypeScript && ctx.typeDeclarationFiles.length === 0) {
    return row('type-definities', 0, evidence, 'Geen type-informatie aanwezig; alles is impliciet (geen TypeScript, geen .d.ts-bestanden).')
  }
  if (ctx.typeDeclarationFiles.length === 0) {
    evidence.push('TypeScript is aanwezig in de dependencies, maar geen gepubliceerde .d.ts-declaraties gevonden')
    return row('type-definities', 1, evidence, 'Types bestaan mogelijk in de broncode, maar voor een klein deel zichtbaar/gepubliceerd; geen .d.ts-bestanden gevonden.')
  }
  const ratio = ctx.componentCount > 0 ? ctx.typeDeclarationFiles.length / ctx.componentCount : 0
  if (ratio < 0.5) {
    evidence.push(`${ctx.typeDeclarationFiles.length} .d.ts-bestanden tegenover ${ctx.componentCount} componenten`)
    return row('type-definities', 2, evidence, 'Types zijn aanwezig voor de meeste componenten, met losse ontbrekende gevallen.')
  }
  evidence.push(`${ctx.typeDeclarationFiles.length} .d.ts-bestanden tegenover ${ctx.componentCount} componenten`)
  return row('type-definities', 3, evidence, 'Volledige, expliciete type-declaraties zijn aanwezig voor vrijwel alle componenten.')
}

function analyzeVoorbeelden(ctx) {
  const evidence = [`storyFiles: ${ctx.storyFiles.length}`, `componentCount: ${ctx.componentCount}`]
  const ratio = ctx.componentCount > 0 ? ctx.storyFiles.length / ctx.componentCount : 0
  if (ratio === 0) {
    const readme = ctx.readmeContent || ''
    const hasCodeBlocks = /```/.test(readme)
    if (hasCodeBlocks) {
      evidence.push(`${ctx.readmeFile} bevat codeblokken, maar geen stories`)
      return row('voorbeelden', 1, evidence, 'Geen stories; alleen losse codevoorbeelden in de README dekken een minderheid van de componenten.')
    }
    return row('voorbeelden', 0, evidence, 'Geen voorbeelden; alleen de kale API-signatuur (indien aanwezig) is te raadplegen.')
  }
  if (ratio < 0.5) {
    return row('voorbeelden', 1, evidence, 'Voorbeelden (stories) bestaan voor een minderheid van de componenten.')
  }
  if (ratio < 0.95) {
    return row('voorbeelden', 2, evidence, 'Voorbeelden bestaan voor de meeste componenten, met hiaten bij een deel ervan.')
  }
  return row('voorbeelden', 3, evidence, 'Minstens één werkend voorbeeld per component is aanwezig (aantal stories komt overeen met aantal componenten).')
}

function analyzeNaamgeving(ctx) {
  const evidence = []
  const readme = ctx.readmeContent || ''
  const contributingFile = ctx.allFiles.find((f) => /^contributing\.md$/i.test(path.basename(f)))
  const contributingContent = contributingFile ? safeRead(ctx, contributingFile) : null
  const namingRe = /naming|naamgeving|prefix|convention|conventie/i
  const readmeDocuments = namingRe.test(readme)
  const contributingDocuments = contributingContent ? namingRe.test(contributingContent) : false

  if (readmeDocuments || contributingDocuments) {
    evidence.push(readmeDocuments ? `${ctx.readmeFile} bevat een sectie over naamgeving/conventies` : `${contributingFile} bevat een sectie over naamgeving/conventies`)
    return row('naamgeving', 2, evidence, 'Een naamgevingspatroon is grotendeels te herkennen en wordt op minstens één plek toegelicht.')
  }
  if (contributingFile) {
    evidence.push(`${contributingFile} gevonden, maar geen expliciete naamgevingsconventie erin aangetroffen`)
  } else {
    evidence.push('geen CONTRIBUTING.md gevonden')
  }
  evidence.push('geen expliciete uitleg over naamgevingsconventie gevonden in README of CONTRIBUTING')
  return row('naamgeving', 0, evidence,
    'Een patroon in de naamgeving is mogelijk zichtbaar in de bestandsnamen zelf, maar het is nergens beschreven of gedocumenteerd -- daarmee is het niet vindbaar zonder de broncode te doorzoeken.')
}

function analyzeDesignTokens(ctx) {
  const evidence = [`designTokenFiles: ${ctx.designTokenFiles.length}`]
  if (ctx.designTokenFiles.length === 0) {
    evidence.push('geen bestand gevonden dat matcht op design-tokens/theme-patroon')
    return row('design-tokens', 0, evidence, 'Geen tokens gevonden; ontwerpwaarden lijken hardcoded verspreid te zijn (geen tokenbestand aangetroffen).')
  }
  if (ctx.designTokenFiles.length === 1) {
    evidence.push(ctx.designTokenFiles[0])
    return row('design-tokens', 2, evidence, 'Een tokenbestand is aanwezig; de meeste designwaarden lopen er vermoedelijk via, met mogelijke hardcoded uitzonderingen.')
  }
  evidence.push(...ctx.designTokenFiles)
  return row('design-tokens', 3, evidence, 'Meerdere tokenbestanden zijn aanwezig; designwaarden lopen via een tokenlaag.')
}

function analyzeCompositiepatroon(ctx) {
  const evidence = []
  const compositionRe = /(layout|composit|samenstel|slot|category|categorie)/i
  let manifestMentionsStructure = false
  for (const rel of ctx.manifestFiles) {
    const content = safeRead(ctx, rel)
    if (content && compositionRe.test(content)) {
      manifestMentionsStructure = true
      evidence.push(`${rel} bevat structurele groepering (categorieën/lagen)`)
      break
    }
  }
  const readme = ctx.readmeContent || ''
  const readmeMentions = compositionRe.test(readme)
  if (readmeMentions) evidence.push(`${ctx.readmeFile} noemt layout-/compositie-begrippen`)

  if (manifestMentionsStructure) {
    return row('compositiepatroon', 2, evidence, 'Samenstelbare bouwstenen (categoriegroepering) bestaan voor de meeste gevallen en zijn vindbaar via het manifestbestand.')
  }
  if (readmeMentions) {
    return row('compositiepatroon', 1, evidence, 'Een samenstelbaar patroon wordt genoemd, maar is niet uitgewerkt als een op te vragen structuur.')
  }
  evidence.push('geen manifest- of README-signaal van een herkenbaar compositiepatroon gevonden')
  return row('compositiepatroon', 0, evidence, 'Geen herkenbaar compositiepatroon vindbaar; elk component lijkt zijn eigen structuur intern te regelen, voor zover na te gaan.')
}

function analyzeVersiebeheer(ctx) {
  const evidence = []
  const version = ctx.packageJson?.version
  const hasVersion = Boolean(version)
  const hasChangelog = Boolean(ctx.changelogFile)
  evidence.push(`package.json version: ${version ?? 'ontbreekt'}`)
  evidence.push(`changelog: ${ctx.changelogFile ?? 'niet gevonden'}`)
  if (!hasVersion && !hasChangelog) {
    return row('versiebeheer', 0, evidence, 'Geen versienummer met betekenis en geen changelog aangetroffen.')
  }
  if (!hasVersion || !hasChangelog) {
    return row('versiebeheer', 1, evidence, 'Slechts één van beide (versienummer of changelog) is aanwezig, niet allebei.')
  }
  const mentionsCurrentVersion = hasVersion && (ctx.changelogContent || '').includes(version)
  evidence.push(`changelog vermeldt huidig versienummer (${version}): ${mentionsCurrentVersion}`)
  if (mentionsCurrentVersion) {
    return row('versiebeheer', 3, evidence, 'Een semantisch versienummer én een changelog zijn beide aanwezig, en de changelog dekt de huidige versie.')
  }
  return row('versiebeheer', 2, evidence, 'Beide bestaan, maar de changelog lijkt niet volledig (huidige versie niet expliciet vermeld).')
}

function analyzeToolingIntegratie(ctx) {
  const evidence = []
  const integrations = []
  if (ctx.mcpConfigFiles.length > 0) {
    integrations.push('mcp-config')
    evidence.push(`MCP-config gevonden: ${ctx.mcpConfigFiles.join(', ')}`)
  }
  const ideManifest = ctx.manifestFiles.filter((f) => /web-types\.json|custom-elements\.json/i.test(f))
  if (ideManifest.length > 0) {
    integrations.push('ide-manifest')
    evidence.push(`IDE-manifest gevonden: ${ideManifest.join(', ')}`)
  }
  const devDeps = { ...(ctx.packageJson?.dependencies || {}), ...(ctx.packageJson?.devDependencies || {}) }
  const depNames = Object.keys(devDeps)
  const hasDocsAddon = depNames.some((d) => d.includes('storybook') && d.includes('docs'))
  if (hasDocsAddon) {
    integrations.push('storybook-docs-addon')
    evidence.push('Storybook docs-addon gevonden in dependencies')
  }
  const mcpAddon = depNames.filter((d) => d.toLowerCase().includes('mcp'))
  if (mcpAddon.length > 0) {
    integrations.push('mcp-addon')
    evidence.push(`MCP-gerelateerde dependency gevonden: ${mcpAddon.join(', ')}`)
  }
  if (integrations.length === 0) {
    evidence.push('geen mcp-config, IDE-manifest, mcp-dependency of docs-addon gevonden')
    return row('tooling-integratie', 0, evidence, 'Geen enkele vorm van tooling-/AI-integratie aanwezig.')
  }
  if (integrations.length === 1) {
    return row('tooling-integratie', 1, evidence, `Eén losse integratie bestaat (${integrations[0]}), verder niets.`)
  }
  if (integrations.length === 2) {
    return row('tooling-integratie', 2, evidence, 'Meerdere integraties bestaan, maar niet noodzakelijk volledig uitgewerkt of geverifieerd.')
  }
  return row('tooling-integratie', 3, evidence, 'Meerdere, werkende integraties zijn aanwezig (o.a. een MCP-gerelateerde dependency naast Storybook-tooling).')
}

function analyzeBroncodeToegankelijkheid(ctx) {
  const evidence = []
  const readme = ctx.readmeContent || ''
  const hasInstallSection = /npm install|npm i\s|yarn add|pnpm add|#+\s*install/i.test(readme)
  evidence.push(`installatie-instructie in README: ${hasInstallSection}`)
  const hasExports = Boolean(ctx.packageJson?.exports)
  const hasMainOrModule = Boolean(ctx.packageJson?.main || ctx.packageJson?.module)
  evidence.push(`package.json exports-veld: ${hasExports}, main/module-veld: ${hasMainOrModule}`)

  if (!hasInstallSection && !hasMainOrModule && !hasExports) {
    return row('broncode-toegankelijkheid', 0, evidence, 'Broncode is niet te installeren of te raadplegen zonder handmatige, niet-gedocumenteerde stappen.')
  }
  if (hasInstallSection && (hasExports || hasMainOrModule)) {
    return row('broncode-toegankelijkheid', 3, evidence, 'Installatie is gedocumenteerd (README) en gedeeltelijk geautomatiseerd via package-metadata.')
  }
  if (hasInstallSection || hasMainOrModule || hasExports) {
    return row('broncode-toegankelijkheid', 2, evidence, 'Installatie is grotendeels gedocumenteerd of via standaard package-metadata te achterhalen.')
  }
  return row('broncode-toegankelijkheid', 1, evidence, 'Installatie is mogelijk, maar vereist grotendeels ongedocumenteerde handmatige stappen.')
}

function analyzeTestdekking(ctx) {
  const evidence = [`testFiles: ${ctx.testFiles.length}`, `componentCount: ${ctx.componentCount}`]
  const devDeps = { ...(ctx.packageJson?.dependencies || {}), ...(ctx.packageJson?.devDependencies || {}) }
  const hasA11yAddon = Object.keys(devDeps).some((d) => d.includes('a11y') || d.includes('axe'))
  const hasVitestAddon = Object.keys(devDeps).some((d) => d.includes('vitest') || d.includes('@storybook/test') || d.includes('jest'))
  const hasTestScript = Object.values(ctx.packageJson?.scripts || {}).some((s) => /vitest|jest/.test(s))
  if (hasA11yAddon) evidence.push('a11y/axe-testtool gevonden in dependencies')
  if (hasVitestAddon) evidence.push('vitest/jest/storybook-test-addon gevonden in dependencies')
  evidence.push(`npm script dat een testrunner aanroept: ${hasTestScript}`)

  const explicitRatio = ctx.componentCount > 0 ? ctx.testFiles.length / ctx.componentCount : 0
  const storyBasedTesting = hasA11yAddon && hasVitestAddon
  const storyRatio = storyBasedTesting && ctx.componentCount > 0 ? ctx.storyFiles.length / ctx.componentCount : 0
  if (storyBasedTesting) {
    evidence.push(`storyFiles: ${ctx.storyFiles.length} (elke story kan via addon-vitest/addon-a11y automatisch getest worden)`)
  }
  const ratio = Math.max(explicitRatio, storyRatio)

  if (ratio === 0 && !hasA11yAddon && !hasVitestAddon) {
    return row('testdekking', 0, evidence, 'Geen geautomatiseerde tests aanwezig.')
  }
  if (ratio === 0) {
    return row('testdekking', 1, evidence, 'Geen losse testbestanden of stories, maar wel testtooling (a11y/testrunner) aanwezig -- dekking is beperkt.')
  }
  if (ratio < 0.9 || !hasTestScript) {
    return row('testdekking', 2, evidence,
      hasTestScript
        ? 'Tests (of story-gebaseerde a11y-checks) zijn aanwezig voor de meeste componenten, met hiaten.'
        : 'Story-gebaseerde testtooling dekt vrijwel alle componenten, maar er is geen expliciet npm-testscript dat dit daadwerkelijk uitvoert.')
  }
  return row('testdekking', 3, evidence, 'Tests zijn aanwezig voor vrijwel elk component, inclusief toegankelijkheidscontroles, en worden via een testscript uitgevoerd.')
}

function analyzeOnderhoudsactiviteit(ctx) {
  const evidence = []
  if (ctx.gitLog === null) {
    evidence.push('geen git-geschiedenis beschikbaar (geen repository of git niet uitvoerbaar)')
    return row('onderhoudsactiviteit', 0, evidence, 'Geen zichtbare geschiedenis; versiebeheer is niet aanwezig of niet toegankelijk.')
  }
  evidence.push(`totalCommits: ${ctx.gitLog.totalCommits ?? 'onbekend'}`)
  evidence.push(`commitCountLast90Days: ${ctx.gitLog.commitCountLast90Days}`)
  const total = ctx.gitLog.totalCommits ?? 0
  if (total <= 1) {
    return row('onderhoudsactiviteit', 1, evidence, 'Geschiedenis is aanwezig maar zeer beperkt (bv. één initiële commit).')
  }
  if (total < 20) {
    return row('onderhoudsactiviteit', 2, evidence, 'Een redelijke geschiedenis van wijzigingen is aanwezig.')
  }
  return row('onderhoudsactiviteit', 3, evidence, 'Een volledige, gedetailleerde geschiedenis van wijzigingen is aanwezig en programmatisch te doorzoeken.')
}

const ANALYZERS = {
  'inventaris': analyzeInventaris,
  'api-documentatie': analyzeApiDocumentatie,
  'type-definities': analyzeTypeDefinities,
  'voorbeelden': analyzeVoorbeelden,
  'naamgeving': analyzeNaamgeving,
  'design-tokens': analyzeDesignTokens,
  'compositiepatroon': analyzeCompositiepatroon,
  'versiebeheer': analyzeVersiebeheer,
  'tooling-integratie': analyzeToolingIntegratie,
  'broncode-toegankelijkheid': analyzeBroncodeToegankelijkheid,
  'testdekking': analyzeTestdekking,
  'onderhoudsactiviteit': analyzeOnderhoudsactiviteit
}

export function analyze(ctx) {
  const rows = CRITERIA.map((criterion) => {
    const fn = ANALYZERS[criterion.id]
    if (!fn) throw new Error(`No beschikbaarheid analyzer implemented for criterion "${criterion.id}"`)
    return fn(ctx)
  })
  return { dimensionId: 'beschikbaarheid', rows }
}
