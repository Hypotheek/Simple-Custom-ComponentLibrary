import fs from 'node:fs'
import path from 'node:path'
import { CRITERIA } from '../rubric.mjs'

// Consistentie asks "is this applied uniformly across the WHOLE library", so every heuristic
// below compares many files against each other rather than just checking presence once.

function readSafe(ctx, rel) {
  try {
    return fs.readFileSync(path.join(ctx.rootDir, rel), 'utf8')
  } catch {
    return null
  }
}

function baseName(rel) {
  return path.basename(rel).replace(/\.(vue|jsx|tsx)$/i, '')
}

function storyBaseName(rel) {
  return path.basename(rel).replace(/\.(stories|story)\.(mdx|[jt]sx?)$/i, '')
}

function sample(list, max = 25) {
  if (list.length <= max) return { items: list, sampled: false }
  const step = list.length / max
  const items = []
  for (let i = 0; i < max; i++) items.push(list[Math.floor(i * step)])
  return { items: [...new Set(items)], sampled: true }
}

function pct(n, d) {
  return d > 0 ? Math.round((n / d) * 1000) / 10 : 0
}

function clampScore(n) {
  return Math.max(0, Math.min(3, Math.round(n)))
}

function realComponentNames(ctx) {
  return new Set(ctx.componentFiles.map(baseName))
}

function manifestCoverage(ctx, realNames) {
  const mentioned = new Set()
  for (const mf of ctx.manifestFiles) {
    const content = readSafe(ctx, mf)
    if (!content) continue
    for (const m of content.matchAll(/['"]([^'"]+)['"]/g)) {
      if (realNames.has(m[1])) mentioned.add(m[1])
    }
  }
  return mentioned
}

function analyzeInventaris(ctx) {
  const realNames = realComponentNames(ctx)
  if (ctx.manifestFiles.length === 0) {
    return {
      score: 0,
      evidence: ['Geen manifestbestand gevonden (custom-elements.json, categories.mjs, web-types.json, ...) om componenten tegen te registreren.'],
      oordeel: 'Zonder enig manifest is er geen registratiepatroon te controleren op consistentie; componenten worden nergens gestructureerd bijgehouden.'
    }
  }
  const mentioned = manifestCoverage(ctx, realNames)
  const coverage = pct(mentioned.size, realNames.size)
  const missing = [...realNames].filter((n) => !mentioned.has(n))
  let score
  if (coverage >= 95) score = 3
  else if (coverage >= 80) score = 2
  else if (coverage >= 50) score = 1
  else score = 0
  const evidence = [`${mentioned.size} van de ${realNames.size} componentbestanden (${coverage}%) komen voor in ${ctx.manifestFiles.join(', ')}.`]
  if (missing.length > 0 && missing.length <= 10) evidence.push(`Ontbrekend in het manifest: ${missing.join(', ')}.`)
  else if (missing.length > 10) evidence.push(`${missing.length} componenten ontbreken in het manifest, o.a. ${missing.slice(0, 5).join(', ')}, ...`)
  const oordeel = coverage >= 95
    ? 'Vrijwel elk component wordt zonder uitzondering op exact dezelfde manier (via hetzelfde manifestbestand) geregistreerd.'
    : coverage >= 80
      ? 'Vrijwel elk component volgt hetzelfde registratiepatroon, met enkele uitzonderingen.'
      : coverage >= 50
        ? 'Een registratiepatroon bestaat, maar wordt niet voor elk component gevolgd.'
        : 'Het manifest dekt een minderheid van de componenten; van een consistent registratiepatroon is nauwelijks sprake.'
  return { score, evidence, oordeel }
}

function analyzeApiDocumentatie(ctx) {
  const { items, sampled } = sample(ctx.componentFiles, 25)
  let checked = 0
  let documented = 0
  for (const rel of items) {
    const content = readSafe(ctx, rel)
    if (content == null) continue
    checked++
    if (/\/\*\*[\s\S]*?\*\//.test(content) || /\/\/.*@(prop|param|type)/i.test(content)) documented++
  }
  const share = pct(documented, checked)
  let score
  if (checked === 0 || share === 0) score = 0
  else if (share < 50) score = 1
  else if (share < 95) score = 2
  else score = 3
  const sampleNote = sampled ? `steekproef van ${checked} van de ${ctx.componentFiles.length} bestanden` : `alle ${checked} bestanden`
  const evidence = [`${documented} van de ${checked} onderzochte componentbestanden (${sampleNote}) bevatten JSDoc- of inline API-documentatie bij props/events.`]
  const oordeel = share === 0
    ? 'Geen van de onderzochte componenten documenteert props/events in een herkenbaar formaat; er is geen documentatiepatroon om consistent toe te passen.'
    : share < 50
      ? 'Een documentatiepatroon is hier en daar te herkennen, maar wordt niet consistent toegepast.'
      : share < 95
        ? 'Vrijwel alle onderzochte componenten volgen hetzelfde documentatieformaat.'
        : 'Alle onderzochte componenten documenteren hun API op exact dezelfde manier.'
  return { score, evidence, oordeel }
}

function typingStyleOf(ctx, rel, content) {
  if (ctx.detectedFramework === 'vue') {
    const isTs = /<script[^>]*\blang=["']ts["']/i.test(content)
    const hasGeneric = /defineProps\s*<[^(]/.test(content)
    return isTs && hasGeneric ? 'ts-generic-props' : isTs ? 'ts-plain' : 'js-runtime-props'
  }
  if (ctx.detectedFramework === 'react') {
    const hasTsInterface = /interface\s+\w*Props/.test(content) || /type\s+\w*Props\s*=/.test(content)
    const hasPropTypes = /PropTypes\./.test(content) || /from ['"]prop-types['"]/.test(content)
    return hasTsInterface ? 'ts-interface' : hasPropTypes ? 'proptypes' : 'untyped'
  }
  return ctx.hasTypeScript && /\.tsx?$/.test(rel) ? 'typed' : 'untyped'
}

function analyzeTypeDefinities(ctx) {
  const { items, sampled } = sample(ctx.componentFiles, 25)
  let checked = 0
  const styleCounts = {}
  for (const rel of items) {
    const content = readSafe(ctx, rel)
    if (content == null) continue
    checked++
    const style = typingStyleOf(ctx, rel, content)
    styleCounts[style] = (styleCounts[style] || 0) + 1
  }
  const ranked = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])
  const [dominantStyle, dominantCount] = ranked[0] || [null, 0]
  const share = pct(dominantCount, checked)
  const singleStyle = ranked.length <= 1
  const typedDominant = dominantStyle && !/untyped|js-runtime-props/.test(dominantStyle)
  let score
  if (checked === 0) score = 0
  else if (singleStyle) {
    // A single observed style is only the rubric's top tier ("uniform, enforced") when it is
    // actually a typed style backed by TS; a library-wide absence of typing has nothing to enforce.
    score = typedDominant && ctx.hasTypeScript ? 3 : 2
  } else if (share >= 90) score = 2
  else if (share >= 50) score = 1
  else score = 0
  const sampleNote = sampled ? `steekproef van ${checked} van de ${ctx.componentFiles.length} bestanden` : `alle ${checked} bestanden`
  const breakdown = ranked.map(([k, v]) => `${k}: ${v}`).join(', ')
  const evidence = [`Verdeling van typeerstijlen over een ${sampleNote}: ${breakdown}.`]
  if (dominantStyle) evidence.push(`${dominantCount} van de ${checked} (${share}%) gebruiken dezelfde stijl ("${dominantStyle}").`)
  const oordeel = checked === 0
    ? 'Geen bestanden konden gelezen worden.'
    : singleStyle
      ? (typedDominant && ctx.hasTypeScript
          ? 'Alle onderzochte componenten gebruiken zonder uitzondering dezelfde, TypeScript-gedekte typeerstijl.'
          : 'Alle onderzochte componenten gebruiken dezelfde stijl, maar het is een ongetypeerde stijl zonder TypeScript of lint-regel die dit afdwingt — dus geen "dwingend afgedwongen" typeerstijl.')
      : share >= 90
        ? 'Vrijwel alle componenten gebruiken dezelfde typeerstijl, met een enkele uitzondering.'
        : share >= 50
          ? 'Eén typeerstijl overheerst, maar met merkbare afwijkingen tussen componenten.'
          : 'Sommige componenten zijn getypeerd, andere niet, zonder dat een dominante stijl te herkennen is.'
  return { score, evidence, oordeel }
}

function analyzeVoorbeelden(ctx) {
  const total = ctx.componentCount
  if (total === 0) return { score: 0, evidence: ['Geen componenten gevonden om voorbeelden aan te toetsen.'], oordeel: 'Niet te beoordelen zonder componenten.' }
  const storyBaseNames = new Set(ctx.storyFiles.map(storyBaseName))
  const componentBaseNames = ctx.componentFiles.map(baseName)
  const matched = componentBaseNames.filter((n) => storyBaseNames.has(n)).length
  const ratio = pct(ctx.storyFiles.length, total)
  const matchShare = pct(matched, total)
  let score
  if (matchShare >= 95) score = 3
  else if (matchShare >= 80) score = 2
  else if (matchShare >= 40) score = 1
  else score = 0
  const evidence = [
    `${ctx.storyFiles.length} storybestanden voor ${total} componentbestanden (verhouding ${ratio}%).`,
    `${matched} van de ${total} componenten (${matchShare}%) hebben een storybestand met exact dezelfde bestandsnaam.`
  ]
  const oordeel = matchShare >= 95
    ? 'Elk voorbeeld volgt exact hetzelfde, afdwingbare format: één stories-bestand per component met identieke bestandsnaam.'
    : matchShare >= 80
      ? 'Vrijwel alle voorbeelden volgen hetzelfde format (één stories-bestand per component), met enkele hiaten.'
      : matchShare >= 40
        ? 'Een voorbeeldformaat bestaat, maar wordt niet overal gevolgd.'
        : 'Voorbeelden dekken slechts een minderheid van de componenten volgens een herkenbaar, gedeeld format.'
  return { score, evidence, oordeel }
}

function analyzeNaamgeving(ctx) {
  const names = ctx.componentFiles.map(baseName)
  if (names.length === 0) return { score: 0, evidence: ['Geen componentbestanden gevonden.'], oordeel: 'Niet te beoordelen zonder componenten.' }
  const prefixCounts = {}
  for (const n of names) {
    const m = n.match(/^[A-Z][a-z0-9]*/)
    const prefix = m ? m[0] : (n[0] || '?')
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1
  }
  const [dominantPrefix, dominantCount] = Object.entries(prefixCounts).sort((a, b) => b[1] - a[1])[0]
  const share = pct(dominantCount, names.length)
  let score
  if (share >= 99) score = 3
  else if (share >= 90) score = 2
  else if (share >= 60) score = 1
  else score = 0
  const evidence = [`${dominantCount} van de ${names.length} componentbestanden (${share}%) beginnen met hetzelfde prefix "${dominantPrefix}".`]
  if (share < 100) {
    const others = Object.entries(prefixCounts).filter(([p]) => p !== dominantPrefix).map(([p, c]) => `${p} (${c})`)
    evidence.push(`Afwijkende prefixen: ${others.join(', ')}.`)
  }
  const oordeel = share >= 99
    ? 'Componentnamen zijn zonder uitzondering consistent: elk bestand deelt hetzelfde prefix.'
    : share >= 90
      ? 'Vrijwel elk component volgt hetzelfde naamgevingspatroon, met een enkele uitzondering.'
      : share >= 60
        ? 'Een basispatroon (gedeeld prefix) wordt gevolgd, maar met merkbare afwijkingen.'
        : 'Namen wisselen goeddeels willekeurig van stijl; er is geen dominant patroon.'
  return { score, evidence, oordeel }
}

function analyzeDesignTokens(ctx) {
  if (ctx.designTokenFiles.length === 0) {
    return {
      score: 0,
      evidence: ['Geen enkel designtokenbestand gevonden (bv. tokens.json, theme.js, design-tokens.yaml).'],
      oordeel: 'Zonder tokenbestand is er niets om consistent te hergebruiken; componenten kunnen alleen zelfstandig, hardcoded waarden gebruiken.'
    }
  }
  const { items, sampled } = sample(ctx.componentFiles, 20)
  let checked = 0
  let hardcoded = 0
  const hardcodedColorRe = /#[0-9a-fA-F]{3,8}\b|rgba?\(/
  for (const rel of items) {
    const content = readSafe(ctx, rel)
    if (content == null) continue
    checked++
    if (hardcodedColorRe.test(content)) hardcoded++
  }
  const hardcodedShare = pct(hardcoded, checked)
  // Conservative cap: we only check for absence of hardcoded literals, not that components
  // actually reference the token set, so this heuristic can never claim the top tier on its own.
  const score = hardcodedShare <= 10 ? 2 : hardcodedShare <= 40 ? 1 : 0
  const sampleNote = sampled ? `steekproef van ${checked} van de ${ctx.componentFiles.length} bestanden` : `alle ${checked} bestanden`
  const evidence = [
    `${ctx.designTokenFiles.length} tokenbestand(en) gevonden: ${ctx.designTokenFiles.join(', ')}.`,
    `${hardcoded} van de ${checked} onderzochte componenten (${sampleNote}) bevatten nog hardcoded kleurwaarden (hex/rgb) in hun <style>.`
  ]
  const oordeel = hardcodedShare <= 10
    ? 'Vrijwel geen onderzochte componenten bevatten hardcoded kleurwaarden, wat op consequent hergebruik van de tokenset wijst — zonder diepere parsing is werkelijk tokengebruik niet te bevestigen, dus de score blijft voorzichtig op "grotendeels aanwezig".'
    : hardcodedShare <= 40
      ? 'Tokens bestaan, maar meerdere componenten gebruiken daarnaast nog eigen, hardcoded waarden.'
      : 'Tokens bestaan, maar worden bij een groot deel van de onderzochte componenten genegeerd ten faveure van hardcoded waarden.'
  return { score, evidence, oordeel }
}

function analyzeCompositiepatroon(ctx) {
  const { items, sampled } = sample(ctx.componentFiles, 25)
  let checked = 0
  let usesSlot = 0
  let importsOtherComponent = 0
  for (const rel of items) {
    const content = readSafe(ctx, rel)
    if (content == null) continue
    checked++
    if (/<slot\b/.test(content)) usesSlot++
    if (/import\s+[A-Z]\w*\s+from\s+['"]\.\/[A-Z]/.test(content)) importsOtherComponent++
  }
  const slotShare = pct(usesSlot, checked)
  const composeShare = pct(importsOtherComponent, checked)
  const idiomShare = Math.max(slotShare, composeShare)
  let score
  if (idiomShare >= 90) score = 3
  else if (idiomShare >= 60) score = 2
  else if (idiomShare >= 25) score = 1
  else score = 0
  const sampleNote = sampled ? `steekproef van ${checked} van de ${ctx.componentFiles.length} bestanden` : `alle ${checked} bestanden`
  const evidence = [
    `${usesSlot} van de ${checked} onderzochte componenten (${slotShare}%, ${sampleNote}) gebruiken <slot> voor content-projectie.`,
    `${importsOtherComponent} van de ${checked} (${composeShare}%) stellen zichzelf intern samen uit andere componenten.`,
    'Let op: datagedreven componenten (tabellen, grafieken, indicatoren) hebben legitiem geen <slot> nodig; dit percentage kan de werkelijke consistentie daardoor onderschatten.'
  ]
  const oordeel = idiomShare >= 90
    ? 'Het compositie-idioom wordt door vrijwel elk onderzocht component gevolgd, zonder uitzondering.'
    : idiomShare >= 60
      ? 'Het compositie-idioom wordt in de meeste gevallen gevolgd.'
      : idiomShare >= 25
        ? 'Een compositie-idioom bestaat, maar wordt naast eigen, incidentele oplossingen gebruikt.'
        : 'Compositie verschilt sterk per component; er is geen dominant, gedeeld idioom herkenbaar.'
  return { score, evidence, oordeel }
}

function analyzeVersiebeheer(ctx) {
  const version = ctx.packageJson?.version
  const semverRe = /^\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?(\+[0-9A-Za-z-.]+)?$/
  const validSemver = typeof version === 'string' && semverRe.test(version)
  const messages = ctx.gitLog?.recentMessagesSample || []
  const conventionalRe = /^[a-z]+(\([\w.-]+\))?!?:\s.+/
  const conventionalCount = messages.filter((m) => conventionalRe.test(m)).length
  const conventionalShare = pct(conventionalCount, messages.length)
  const evidence = [
    version
      ? `Huidig versienummer "${version}" ${validSemver ? 'volgt' : 'volgt NIET'} het semver-schema (major.minor.patch).`
      : 'Geen versienummer gevonden in package.json.'
  ]
  evidence.push(messages.length > 0
    ? `${conventionalCount} van de ${messages.length} recente commitberichten (${conventionalShare}%) volgen het conventional-commits-formaat ("type: bericht").`
    : 'Geen commit-geschiedenis beschikbaar om het patroon rond releases te toetsen.')
  // Correct major/minor/patch usage per change can only be verified against the full release
  // history, not a single snapshot, so this heuristic is capped below the rubric's top tier.
  let score
  if (!validSemver) score = 0
  else if (messages.length === 0 || conventionalShare >= 50) score = 2
  else score = 1
  const oordeel = !validSemver
    ? 'Het huidige versienummer volgt geen herkenbaar semver-schema; van consistente versietoepassing is geen sprake.'
    : score === 2
      ? 'Het versienummer is geldig semver en de beschikbare signalen wijzen niet op afwijkingen — de correctheid van major/minor/patch-keuzes per wijziging is echter niet te verifiëren zonder de volledige releasegeschiedenis, dus de score blijft voorzichtig.'
      : 'Het versienummer is geldig semver, maar commitberichten volgen geen herkenbaar, dwingend format; of semver ook bij elke wijziging correct wordt toegepast is met deze momentopname niet vast te stellen.'
  return { score, evidence, oordeel }
}

function analyzeToolingIntegratie(ctx) {
  const realNames = realComponentNames(ctx)
  const signals = []

  if (ctx.manifestFiles.length > 0) {
    const mentioned = manifestCoverage(ctx, realNames)
    signals.push({ name: `manifest (${ctx.manifestFiles.join(', ')})`, coverage: pct(mentioned.size, realNames.size) })
  }
  if (ctx.hasStorybook) {
    const storyBaseNames = new Set(ctx.storyFiles.map(storyBaseName))
    const matched = [...realNames].filter((n) => storyBaseNames.has(n)).length
    signals.push({ name: 'Storybook stories', coverage: pct(matched, realNames.size) })
  }
  if (ctx.mcpConfigFiles.length > 0) {
    signals.push({ name: `MCP-config (${ctx.mcpConfigFiles.join(', ')})`, coverage: null })
  }
  const storybookAddons = Object.keys({ ...(ctx.packageJson?.devDependencies || {}), ...(ctx.packageJson?.dependencies || {}) })
    .filter((d) => d.startsWith('@storybook/addon-'))
  if (storybookAddons.length > 0) {
    signals.push({ name: `Storybook-addons (${storybookAddons.join(', ')})`, coverage: null })
  }

  if (signals.length === 0) {
    return {
      score: 0,
      evidence: ['Geen enkele tooling-/AI-integratie gevonden (geen manifest, geen MCP-config, geen Storybook).'],
      oordeel: 'Zonder integraties is er niets om consistent te dekken.'
    }
  }

  const measured = signals.filter((s) => s.coverage !== null)
  const minCoverage = measured.length > 0 ? Math.min(...measured.map((s) => s.coverage)) : null
  let score
  if (measured.length === 0) score = 1
  else if (minCoverage >= 95) score = 3
  else if (minCoverage >= 70) score = 2
  else if (minCoverage >= 30) score = 1
  else score = 0
  const evidence = signals.map((s) => s.coverage !== null
    ? `${s.name}: dekt ${s.coverage}% van de ${realNames.size} componenten.`
    : `${s.name}: aanwezig (dekking niet per-component meetbaar).`)
  const oordeel = measured.length === 0
    ? `${signals.length} integratie(s) gevonden, maar hun dekking van de componentenset is niet per-component meetbaar.`
    : minCoverage >= 95
      ? 'Alle meetbare integraties dekken zonder uitzondering de volledige, actuele componentenset.'
      : minCoverage >= 70
        ? 'Alle beschikbare, meetbare integraties dekken vrijwel de volledige componentenset.'
        : minCoverage >= 30
          ? 'Eén integratie dekt de meeste componenten, andere dekken minder.'
          : 'Integraties dekken maar een deel van de componenten, willekeurig verdeeld.'
  return { score, evidence, oordeel }
}

function analyzeBroncodeToegankelijkheid(ctx) {
  const exportsField = ctx.packageJson?.exports
  if (!exportsField) {
    const hasMain = Boolean(ctx.packageJson?.main || ctx.packageJson?.module)
    return {
      score: hasMain ? 1 : 0,
      evidence: [hasMain ? 'package.json heeft alleen "main"/"module", geen "exports"-veld.' : 'package.json bevat geen "main", "module" of "exports"-veld.'],
      oordeel: 'Zonder een "exports"-veld is er geen expliciete, gestructureerde installatiemethode om als consistent te beoordelen.'
    }
  }
  const entryPoints = Object.keys(exportsField)
  const subpathEntries = entryPoints.filter((e) => e !== '.')
  const subpathsLookOrdered = subpathEntries.every((e) => /^\.\/[\w.-]+$/.test(e))
  let score
  if (entryPoints.length === 1 || subpathsLookOrdered) score = 3
  else score = subpathEntries.length <= 3 ? 2 : 1
  const evidence = [`"exports"-veld bevat ${entryPoints.length} ingang(en): ${entryPoints.join(', ')}.`]
  const oordeel = score === 3
    ? 'Eén enkele, gedocumenteerde methode (het "exports"-veld met een hoofdingang en voorspelbare subpaden) is de enige ondersteunde weg naar de broncode, zonder uitzondering.'
    : score === 2
      ? 'Eén methode wordt vrijwel overal consequent aangehouden, met een beperkt aantal losse subpaden.'
      : 'De installatie-/exportmethode oogt ad-hoc, met meerdere ongestructureerde ingangen.'
  return { score, evidence, oordeel }
}

function analyzeTestdekking(ctx) {
  const total = ctx.componentCount
  if (total === 0) return { score: 0, evidence: ['Geen componenten gevonden.'], oordeel: 'Niet te beoordelen zonder componenten.' }
  if (ctx.testFiles.length === 0) {
    return {
      score: 0,
      evidence: [`0 testbestanden gevonden voor ${total} componenten.`],
      oordeel: 'Testaanpak ontbreekt grotendeels; er is geen testpatroon om consistent toe te passen.'
    }
  }
  const testBaseNames = new Set(ctx.testFiles.map((f) => path.basename(f).replace(/\.(test|spec)\.[jt]sx?$/i, '')))
  const componentBaseNames = ctx.componentFiles.map(baseName)
  const matched = componentBaseNames.filter((n) => testBaseNames.has(n)).length
  const matchShare = pct(matched, total)
  let score
  if (matchShare >= 95) score = 3
  else if (matchShare >= 80) score = 2
  else if (matchShare >= 30) score = 1
  else score = 0
  const evidence = [
    `${ctx.testFiles.length} testbestanden voor ${total} componenten.`,
    `${matched} van de ${total} componenten (${matchShare}%) hebben een testbestand met overeenkomstige naam.`
  ]
  const oordeel = matchShare >= 95
    ? 'Elk component wordt op exact dezelfde manier en met dezelfde dekking getest.'
    : matchShare >= 80
      ? 'Vrijwel alle componenten volgen hetzelfde testpatroon.'
      : matchShare >= 30
        ? 'Eén testpatroon bestaat, maar wordt niet overal toegepast.'
        : 'Testaanpak verschilt sterk per component of ontbreekt grotendeels.'
  return { score, evidence, oordeel }
}

function analyzeOnderhoudsactiviteit(ctx) {
  const log = ctx.gitLog
  if (!log) {
    return {
      score: 0,
      evidence: ['Geen git-geschiedenis beschikbaar (geen git-repository of git niet geïnstalleerd).'],
      oordeel: 'Onderhoudscadans is niet te beoordelen zonder geschiedenis.'
    }
  }
  const { totalCommits, commitCountLast90Days } = log
  if (!totalCommits || totalCommits < 5) {
    return {
      score: 1,
      evidence: [`Slechts ${totalCommits ?? 0} commit(s) in de geschiedenis; te weinig data om een cadans te herkennen.`],
      oordeel: 'Met zo weinig geschiedenis is een regelmatige cadans niet aan te tonen; dit is een voorzichtige inschatting.'
    }
  }
  const recentShare = pct(commitCountLast90Days, totalCommits)
  // A single snapshot can show whether activity is spread out or bunched into a recent burst,
  // but never "aantoonbaar voorspelbaar" (demonstrably predictable) over time, so cap below 3.
  const score = recentShare >= 10 && recentShare <= 70 ? 2 : 1
  const evidence = [
    `${totalCommits} commits in totaal, waarvan ${commitCountLast90Days} in de laatste 90 dagen (${recentShare}%).`,
    'Dit is een momentopname van één meting; een aantoonbaar regelmatige cadans vereist metingen over meerdere periodes.'
  ]
  const oordeel = score === 2
    ? 'De verhouding tussen recente en totale activiteit wijst op een herkenbare, redelijk regelmatige cadans, zonder dat alle activiteit in één recente uitbarsting valt.'
    : recentShare > 70
      ? 'Een groot deel van alle commits vond in de laatste 90 dagen plaats, wat eerder op een uitbarsting dan op een gestage, regelmatige cadans wijst.'
      : 'Recente activiteit is beperkt ten opzichte van de totale geschiedenis; van een aantoonbaar regelmatige cadans is op basis hiervan geen sprake.'
  return { score, evidence, oordeel }
}

const ANALYZERS = {
  inventaris: analyzeInventaris,
  'api-documentatie': analyzeApiDocumentatie,
  'type-definities': analyzeTypeDefinities,
  voorbeelden: analyzeVoorbeelden,
  naamgeving: analyzeNaamgeving,
  'design-tokens': analyzeDesignTokens,
  compositiepatroon: analyzeCompositiepatroon,
  versiebeheer: analyzeVersiebeheer,
  'tooling-integratie': analyzeToolingIntegratie,
  'broncode-toegankelijkheid': analyzeBroncodeToegankelijkheid,
  testdekking: analyzeTestdekking,
  onderhoudsactiviteit: analyzeOnderhoudsactiviteit
}

export function analyze(ctx) {
  const rows = CRITERIA.map((criterion) => {
    const fn = ANALYZERS[criterion.id]
    const result = fn
      ? fn(ctx)
      : { score: 0, evidence: ['Geen consistentie-heuristiek geïmplementeerd voor dit criterium.'], oordeel: 'Niet beoordeeld.' }
    return {
      criterionId: criterion.id,
      score: clampScore(result.score),
      max: 3,
      evidence: result.evidence,
      oordeel: result.oordeel
    }
  })
  return { dimensionId: 'consistentie', rows }
}
