// Scores the "actualiteit" (currency / up-to-dateness) column: for each criterion, is what
// exists still in sync with the current state of the source code, or has it drifted/gone stale?
// ctx.gitLog can be null (no git available) -- every scorer that leans on it degrades explicitly
// rather than silently guessing a middling score.

import fs from 'node:fs'
import path from 'node:path'
import { CRITERIA } from '../rubric.mjs'

function daysSince(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return (Date.now() - d.getTime()) / 86400000
}

function mergedDeps(pkg) {
  return { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}), ...(pkg?.peerDependencies || {}) }
}

function scriptsBlob(pkg) {
  return Object.values(pkg?.scripts || {}).join(' ')
}

function readFileSafe(ctx, relPath) {
  try {
    return fs.readFileSync(path.join(ctx.rootDir, relPath), 'utf8')
  } catch {
    return null
  }
}

function countJsonEntries(data) {
  if (Array.isArray(data)) return data.length
  if (data && typeof data === 'object') {
    const values = Object.values(data)
    if (values.length && values.every((v) => Array.isArray(v))) return values.reduce((sum, v) => sum + v.length, 0)
    return Object.keys(data).length
  }
  return 0
}

// Best-effort entry count for a manifest file, JSON or plain JS/TS. For JS/TS we only look
// inside array literals (`[...]`) so stray quoted words elsewhere (e.g. a fallback return value)
// don't get miscounted as inventory entries.
function countManifestEntries(ctx, relPath) {
  const text = readFileSafe(ctx, relPath)
  if (text === null) return null
  if (relPath.endsWith('.json')) {
    try {
      return countJsonEntries(JSON.parse(text))
    } catch {
      return null
    }
  }
  const arrayBlocks = text.match(/\[[^[\]]*\]/g) || []
  const combined = arrayBlocks.join(' ')
  const tokens = combined.match(/['"`]([A-Za-z][A-Za-z0-9_-]*)['"`]/g) || []
  return new Set(tokens.map((t) => t.slice(1, -1))).size
}

function scoreInventaris(ctx) {
  const manifest = ctx.manifestFiles[0] || null
  if (!manifest) {
    return {
      score: 0,
      evidence: [
        `geen manifestbestand gevonden (ctx.manifestFiles is leeg) bij ${ctx.componentCount} gedetecteerde componenten`,
        'zonder gestructureerde inventarislijst is er niets waarvan de actualiteit beoordeeld kan worden'
      ],
      oordeel: 'Er bestaat geen gestructureerde componentenlijst, dus dit criterium scoort per definitie 0: er is niets dat kan verouderen.'
    }
  }
  const count = countManifestEntries(ctx, manifest)
  if (count === null || ctx.componentCount === 0) {
    return {
      score: 1,
      evidence: [`manifest "${manifest}" gevonden maar kon niet betrouwbaar geteld worden, of componentCount is 0 (componentCount=${ctx.componentCount})`],
      oordeel: 'Er is een manifestbestand, maar de inhoud kon niet betrouwbaar tegen het aantal componenten worden afgezet; conservatief beoordeeld.'
    }
  }
  const ratio = count / ctx.componentCount
  const gap = ctx.componentCount - count
  const score = ratio >= 0.98 ? 3 : ratio >= 0.85 ? 2 : ratio >= 0.5 ? 1 : 0
  return {
    score,
    evidence: [
      `manifest "${manifest}" bevat naar schatting ${count} vermeldingen tegenover ${ctx.componentCount} gedetecteerde componentbestanden (gat: ${gap})`,
      ctx.manifestFiles.length > 1 ? `nog ${ctx.manifestFiles.length - 1} ander(e) manifestbestand(en) gevonden, niet meegeteld: ${ctx.manifestFiles.slice(1).join(', ')}` : 'dit is het enige gevonden manifestbestand'
    ],
    oordeel:
      score === 3
        ? 'De inventarislijst komt vrijwel exact overeen met het aantal componenten in de broncode; geen aanwijsbare drift.'
        : score === 0
          ? 'De inventarislijst wijkt sterk af van het daadwerkelijke aantal componenten en is aantoonbaar verouderd.'
          : 'De inventarislijst komt grotendeels overeen met de broncode, met een merkbaar gat dat op enige achterstand wijst.'
  }
}

function scoreApiDocumentatie(ctx) {
  const deps = mergedDeps(ctx.packageJson)
  const docgenDeps = Object.keys(deps).filter((d) => /addon-docs|addon-mcp/i.test(d))
  const docgenSignal = ctx.hasStorybook && docgenDeps.length > 0
  const evidence = []
  if (ctx.gitLog === null) {
    evidence.push('ctx.gitLog is null: geen commit-geschiedenis beschikbaar om actieve doorontwikkeling (en dus documentatie-driftrisico) te toetsen')
  } else {
    evidence.push(`${ctx.gitLog.commitCountLast90Days} commits in de afgelopen 90 dagen (zwakke proxy: actief project maakt stilzwijgend verouderde documentatie minder waarschijnlijk)`)
  }
  if (docgenSignal) evidence.push(`Storybook-docsaddon(s) aanwezig (${docgenDeps.join(', ')}) die props/events/slots doorgaans rechtstreeks uit de componentbroncode afleiden`)
  evidence.push('beperking: zonder diepe parsing per component kan niet hard geverifieerd worden dat elke prop/event/slot exact overeenkomt met de huidige code')

  const score = docgenSignal ? 2 : ctx.gitLog && ctx.gitLog.commitCountLast90Days > 0 ? 1 : ctx.gitLog === null ? 1 : 0
  const oordeel = docgenSignal
    ? 'Documentatie lijkt grotendeels automatisch afgeleid uit de componentbroncode (Storybook-docgen-tooling), wat het risico op stilzwijgende veroudering verkleint, al is dit niet per prop geverifieerd.'
    : ctx.gitLog
      ? 'Geen sterk bewijs dat documentatie automatisch wordt gegenereerd of getest; actieve commit-activiteit is slechts een zwakke aanwijzing dat documentatie niet is stilgevallen.'
      : 'Zonder git-geschiedenis en zonder aanwijzing van automatische documentatiegeneratie kan de actualiteit niet worden onderbouwd; conservatief beoordeeld.'
  return { score, evidence, oordeel }
}

function scoreTypeDefinities(ctx) {
  if (!ctx.typeDeclarationFiles.length) {
    return {
      score: 0,
      evidence: [`ctx.typeDeclarationFiles is leeg (hasTypeScript=${ctx.hasTypeScript})`, `geen enkel .d.ts-bestand gevonden voor de ${ctx.componentCount} componenten`],
      oordeel: 'Er bestaan geen type-declaraties, dus deze kunnen ook niet actueel zijn; dit criterium scoort per definitie 0 omdat types ontbreken.'
    }
  }
  const blob = scriptsBlob(ctx.packageJson)
  const genSignal = /\btsc\b|vue-tsc|vite build|\bdts\b|typegen/i.test(blob)
  const score = genSignal ? 3 : 1
  return {
    score,
    evidence: [`${ctx.typeDeclarationFiles.length} .d.ts-bestand(en) gevonden`, `build/prepack/prepare-scripts: "${blob || '(geen scripts)'}"`],
    oordeel: genSignal
      ? 'Type-declaraties worden blijkbaar bij elke build automatisch gegenereerd (een build/prepack-script roept een type-generator aan), waardoor ze niet stilzwijgend kunnen verouderen.'
      : 'Type-declaraties zijn aanwezig, maar er is geen build-script gevonden dat ze automatisch genereert; ze lijken handmatig bijgehouden en kunnen achterlopen.'
  }
}

function scoreVoorbeelden(ctx) {
  if (ctx.componentCount === 0) {
    return {
      score: 1,
      evidence: ['componentCount is 0: geen basis om voorbeelddekking tegen af te zetten'],
      oordeel: 'Er zijn geen componenten gedetecteerd om de actualiteit van voorbeelden tegen af te zetten; neutraal beoordeeld.'
    }
  }
  const ratio = ctx.storyFiles.length / ctx.componentCount
  let score = ratio >= 0.95 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0
  const evidence = [`${ctx.storyFiles.length} story-bestanden tegenover ${ctx.componentCount} componenten (dekking: ${Math.round(ratio * 100)}%)`]
  if (ctx.gitLog === null) {
    evidence.push('ctx.gitLog is null: kan niet bevestigen of recent toegevoegde componenten voorbeelden misten')
  } else if (ctx.gitLog.commitCountLast90Days > 0 && ratio < 0.95) {
    score = Math.max(0, score - 1)
    evidence.push(`${ctx.gitLog.commitCountLast90Days} commits in de afgelopen 90 dagen terwijl de dekking niet compleet is: voorbeelden lijken niet stelselmatig mee te groeien met nieuwe componenten`)
  }
  const oordeel =
    score >= 3
      ? 'Vrijwel elk component heeft een bijbehorend voorbeeldbestand; voorbeelden lijken consequent actueel gehouden.'
      : score === 0
        ? 'Een groot deel van de componenten mist voorbeelden, wat op structureel achterblijvende voorbeelden wijst.'
        : 'De meeste componenten hebben voorbeelden, maar de dekking is niet compleet, wat op enige achterstand wijst.'
  return { score, evidence, oordeel }
}

function scoreNaamgeving(ctx) {
  const basenames = ctx.componentFiles.map((f) => path.basename(f).replace(/\.(vue|jsx|tsx)$/, ''))
  let ratio = 1
  if (basenames.length) {
    const firstChars = {}
    for (const b of basenames) firstChars[b[0] || ''] = (firstChars[b[0] || ''] || 0) + 1
    const dominant = Math.max(0, ...Object.values(firstChars))
    ratio = dominant / basenames.length
  }
  const renameSignal = ctx.gitLog?.recentMessagesSample?.some((m) => /rename|hernoem/i.test(m)) || false
  const evidence = [`${basenames.length} componentbestanden; ${Math.round(ratio * 100)}% deelt hetzelfde beginteken in de bestandsnaam (huidige-staat-consistentie)`]
  if (ctx.gitLog) {
    evidence.push(
      renameSignal
        ? 'recente commit-berichten bevatten aanwijzingen van hernoemen/naamgeving-refactors'
        : `geen van de laatste ${ctx.gitLog.recentMessagesSample.length} commit-berichten wijst op hernoemen; geen directe aanwijzing van patroon-drift`
    )
  } else {
    evidence.push('ctx.gitLog is null: kan commit-geschiedenis niet raadplegen op hernoem-signalen')
  }
  const score = renameSignal ? 1 : ratio >= 0.98 ? 2 : ratio >= 0.8 ? 1 : 0
  const oordeel = renameSignal
    ? 'Recente commit-berichten wijzen op hernoemen/refactoren van naamgeving, wat op een verschuivend patroon duidt.'
    : ratio >= 0.98
      ? 'Het patroon is in de huidige broncode zonder uitzondering consistent en niets in de recente geschiedenis wijst op drift; dit is een inferentie uit afwezigheid van tegenbewijs, geen bewezen stabiliteit over de volledige geschiedenis.'
      : ratio >= 0.8
        ? 'De meeste componenten volgen hetzelfde patroon, maar er zijn uitzonderingen in de huidige broncode die op beginnende drift kunnen wijzen.'
        : 'Een aanzienlijk deel van de componenten wijkt af van het dominante patroon, wat op een verschuivend patroon wijst.'
  return { score, evidence, oordeel }
}

function scoreDesignTokens(ctx) {
  if (!ctx.designTokenFiles.length) {
    return {
      score: 1,
      evidence: [
        'ctx.designTokenFiles is leeg: geen apart tokenbestand gevonden',
        'zonder brondocument kan niet worden geverifieerd of designwaarden in componenten nog kloppen met een tokenbron; conservatief in het midden gescoord (niet 0 of 3, want er is geen concreet bewijs van mismatch of van synchronisatie)'
      ],
      oordeel: 'Er is geen tokenbestand om tegen te toetsen, dus de actualiteit van tokens-versus-gebruik kan niet sterk worden vastgesteld via statische analyse.'
    }
  }
  const blob = scriptsBlob(ctx.packageJson)
  const tokenNames = ctx.designTokenFiles.map((f) => path.basename(f))
  const buildReferencesTokens = /token|style-dictionary/i.test(blob) || tokenNames.some((n) => blob.includes(n))
  const score = buildReferencesTokens ? 2 : 1
  return {
    score,
    evidence: [
      `${ctx.designTokenFiles.length} tokenbestand(en) gevonden: ${tokenNames.join(', ')}`,
      buildReferencesTokens
        ? 'een build/prepack-script lijkt de tokens te verwerken, wat de kans verkleint dat gebruik en tokens uiteenlopen'
        : 'geen build-script gevonden dat expliciet naar tokens verwijst; synchronisatie met daadwerkelijk gebruik kan niet worden bevestigd'
    ],
    oordeel: buildReferencesTokens
      ? 'Tokens lijken via een buildstap verwerkt te worden, een zwak positief signaal voor synchronisatie met daadwerkelijk gebruik.'
      : 'Tokens bestaan, maar zonder build-koppeling of diepe cross-referentie kan niet worden vastgesteld of gebruik nog aansluit; conservatief beoordeeld.'
  }
}

function scoreCompositiepatroon(ctx) {
  if (ctx.gitLog === null) {
    return {
      score: 1,
      evidence: ['ctx.gitLog is null: geen commit-geschiedenis om actieve herstructurering of stabiliteit van het compositiepatroon te toetsen'],
      oordeel: 'Zonder git-geschiedenis kan de actualiteit van het compositiepatroon niet worden onderbouwd; conservatief in het midden gescoord.'
    }
  }
  const restructureSignal = ctx.gitLog.recentMessagesSample.some((m) => /refactor|restructure|herstructureer|breaking/i.test(m))
  const extendSignal = ctx.gitLog.recentMessagesSample.some((m) => /primitive|composition|compositie|layout/i.test(m))
  const evidence = [`${ctx.gitLog.recentMessagesSample.length} recente commit-berichten doorzocht op herstructurering-/breaking-aanwijzingen`]
  const score = restructureSignal ? 1 : 2
  evidence.push(
    restructureSignal
      ? 'commit-berichten bevatten aanwijzingen van herstructurering/breaking changes'
      : extendSignal
        ? 'recente commits breiden het compositiestelsel uit (bv. nieuwe layout-primitieven) zonder aanwijzing dat het bestaande patroon wordt doorbroken'
        : 'geen aanwijzing van herstructurering gevonden; dit is een inferentie uit afwezigheid van tegenbewijs'
  )
  const oordeel = restructureSignal
    ? 'Recente commit-berichten wijzen op herstructurering, wat duidt op een verschuivend compositiepatroon.'
    : 'Niets in de recente geschiedenis wijst op het doorbreken van het compositiepatroon; het patroon wordt conservatief als stabiel beschouwd op basis van afwezigheid van tegenbewijs, niet als bewezen stabiliteit over de volledige geschiedenis.'
  return { score, evidence, oordeel }
}

function scoreVersiebeheer(ctx) {
  if (!ctx.changelogFile) {
    return {
      score: 0,
      evidence: [`geen changelog-bestand gevonden (package.json version=${ctx.packageJson?.version ?? 'onbekend'})`],
      oordeel: 'Er bestaat geen changelog, dus er is niets dat actueel of verouderd kan zijn; dit criterium scoort per definitie 0.'
    }
  }
  const pkgVersion = ctx.packageJson?.version || null
  const match = (ctx.changelogContent || '').match(/(\d+\.\d+\.\d+)/)
  const latestInChangelog = match ? match[1] : null
  let score
  let note
  if (!latestInChangelog) {
    score = 1
    note = 'geen herkenbaar versienummer gevonden in de changelog-inhoud'
  } else if (pkgVersion && latestInChangelog === pkgVersion) {
    score = 3
    note = `changelog-versie (${latestInChangelog}) komt exact overeen met package.json (${pkgVersion})`
  } else {
    score = 1
    note = `changelog-versie (${latestInChangelog}) wijkt af van package.json (${pkgVersion ?? 'onbekend'})`
  }
  return {
    score,
    evidence: [`changelog-bestand: ${ctx.changelogFile}`, note],
    oordeel:
      score === 3
        ? 'De meest recente changelog-vermelding komt exact overeen met het huidige packageversienummer.'
        : latestInChangelog
          ? 'De changelog loopt achter op (of wijkt af van) het huidige packageversienummer, wat op een gemiste of vertraagde update wijst.'
          : 'De changelog bestaat, maar het laatste versienummer kon niet betrouwbaar worden vastgesteld.'
  }
}

function scoreToolingIntegratie(ctx) {
  const deps = mergedDeps(ctx.packageJson)
  const ideManifest = ctx.manifestFiles.some((f) => /custom-elements\.json|web-types\.json/i.test(f))
  const mcpFiles = ctx.mcpConfigFiles.length > 0
  const mcpDep = Object.keys(deps).some((d) => /mcp/i.test(d))
  if (!ideManifest && !mcpFiles && !mcpDep) {
    return {
      score: 0,
      evidence: ['geen MCP-config, IDE-manifest (custom-elements.json/web-types.json) of MCP-gerelateerde dependency gevonden'],
      oordeel: 'Er is geen tooling-/AI-integratie gedetecteerd, dus dit criterium scoort per definitie 0: er is niets dat actueel of verouderd kan zijn.'
    }
  }
  const evidence = []
  let score
  if (mcpFiles) {
    const pkgVersion = ctx.packageJson?.version
    const mentionsVersion = ctx.mcpConfigFiles.some((f) => {
      const text = readFileSafe(ctx, f)
      return Boolean(text && pkgVersion && text.includes(pkgVersion))
    })
    score = mentionsVersion ? 3 : 2
    evidence.push(`${ctx.mcpConfigFiles.length} MCP-configbestand(en) gevonden${mentionsVersion ? '; verwijst naar de huidige packageversie' : '; geen directe versiereferentie gevonden'}`)
  } else if (mcpDep) {
    const related = Object.keys(deps).filter((d) => /mcp/i.test(d) || d.startsWith('@storybook/'))
    const versions = new Set(related.map((d) => deps[d]))
    const synchronized = related.length > 1 && versions.size === 1
    if (synchronized) {
      score = 2
      evidence.push(`tooling-dependencies: ${related.join(', ')} staan allemaal op exact dezelfde versie (${[...versions][0]}), wat op gecoördineerd onderhoud wijst`)
    } else if (ctx.gitLog) {
      score = ctx.gitLog.commitCountLast90Days > 0 ? 1 : 0
      evidence.push(`tooling-dependencies: ${related.join(', ')} (versies: ${[...versions].join(', ')})`, `fallback op commit-recentheid: ${ctx.gitLog.commitCountLast90Days} commits in de afgelopen 90 dagen`)
    } else {
      score = 1
      evidence.push(`tooling-dependencies: ${related.join(', ')} (versies: ${[...versions].join(', ')})`, 'ctx.gitLog is null: geen fallback-signaal beschikbaar, conservatief beoordeeld')
    }
  } else {
    score = 1
    evidence.push('IDE-manifestbestand gevonden, maar geen versie-informatie om tegen de packageversie af te zetten')
  }
  return {
    score,
    evidence,
    oordeel:
      score >= 2
        ? 'De tooling-integratie lijkt gesynchroniseerd met de rest van het project (consistente versies en/of een verwijzing naar de huidige packageversie).'
        : 'Er is een tooling-integratie aanwezig, maar de actualiteit ervan kon alleen zwak worden onderbouwd (via commit-recentheid, niet via een directe versie-check).'
  }
}

function scoreBroncodeToegankelijkheid(ctx) {
  if (!ctx.readmeFile || !ctx.packageJson?.name) {
    return {
      score: 0,
      evidence: [`readmeFile=${ctx.readmeFile ?? 'null'}, packageJson.name=${ctx.packageJson?.name ?? 'null'}`],
      oordeel: 'Zonder README en/of packagenaam kan installatiedocumentatie niet tegen de werkelijke package worden geverifieerd; dit criterium scoort per definitie 0.'
    }
  }
  const readme = ctx.readmeContent || ''
  const pkgName = ctx.packageJson.name
  const installMatches = [...readme.matchAll(/(?:npm install|npm i|yarn add|pnpm add)[ \t]+([^\s`]+)/gi)].map((m) => m[1])
  const conflicting = installMatches.filter((tok) => !tok.includes(pkgName) && !tok.startsWith('.') && !tok.startsWith('/') && !tok.startsWith('github:') && !tok.startsWith('http'))
  const evidence = [`packagenaam: "${pkgName}"`, `${installMatches.length} install-commando('s) met argument gevonden in de README: ${installMatches.join(', ') || '(geen)'}`]
  let score
  if (conflicting.length) {
    score = 1
    evidence.push(`mogelijk verouderde/afwijkende packagenaam in install-instructie: ${conflicting.join(', ')}`)
  } else {
    score = 2
    evidence.push('geen install-instructie gevonden die een andere packagenaam noemt dan package.json; geen geautomatiseerde installatietest gevonden om dit verder te bevestigen')
  }
  return {
    score,
    evidence,
    oordeel:
      score === 1
        ? 'De README verwijst naar een andere packagenaam dan package.json aangeeft, een concreet signaal dat de installatie-instructies verouderd zijn.'
        : 'Installatie-instructies en package.json lijken op elkaar afgestemd, maar dit wordt niet geautomatiseerd getest, dus de hoogste score is niet gerechtvaardigd.'
  }
}

function scoreTestdekking(ctx) {
  if (!ctx.testFiles.length) {
    return {
      score: 0,
      evidence: [`ctx.testFiles is leeg (0 testbestanden) bij ${ctx.componentCount} componenten`],
      oordeel: 'Er zijn geen geautomatiseerde tests, dus er is niets dat actueel of verouderd kan zijn; dit criterium scoort per definitie 0.'
    }
  }
  const evidence = [`${ctx.testFiles.length} testbestand(en) gevonden`]
  let score
  if (ctx.gitLog === null) {
    score = 1
    evidence.push('ctx.gitLog is null: kan niet nagaan of tests recent zijn bijgewerkt; conservatief beoordeeld')
  } else {
    const positiveSignal = ctx.gitLog.recentMessagesSample.some((m) => /\btest(s)?\b|spec|fix test/i.test(m))
    evidence.push(
      positiveSignal
        ? 'recente commit-berichten verwijzen naar tests/specs, wat op actief onderhoud van tests wijst'
        : `geen van de laatste ${ctx.gitLog.recentMessagesSample.length} commit-berichten verwijst naar tests; geen direct bewijs van actief testonderhoud`
    )
    score = positiveSignal ? 2 : 1
  }
  return {
    score,
    evidence,
    oordeel:
      score === 2
        ? 'Recente commit-berichten wijzen op actief onderhoud van tests, wat de kans op stilzwijgend verouderde tests verkleint.'
        : 'Tests bestaan, maar er is geen sterk bewijs van recent onderhoud gevonden; conservatief beoordeeld.'
  }
}

function scoreOnderhoudsactiviteit(ctx) {
  if (ctx.gitLog === null) {
    return {
      score: 0,
      evidence: [
        'ctx.gitLog is null: geen git-geschiedenis beschikbaar (geen repository, of git niet geïnstalleerd)',
        'zonder enige geschiedenis kan geen recente onderhoudsactiviteit worden aangetoond'
      ],
      oordeel: 'Er is geen git-geschiedenis om onderhoudsactiviteit op te toetsen; dit wordt bewust conservatief als niet-aantoonbaar-actueel (0) beoordeeld, niet als een stilzwijgende middenscore, omdat er letterlijk geen bewijs van recente activiteit is.'
    }
  }
  const days = daysSince(ctx.gitLog.lastCommitDate)
  const cadence = ctx.gitLog.commitCountLast90Days
  let score
  if (days === null) score = 0
  else if (days < 30) score = cadence >= 5 ? 3 : 2
  else if (days < 180) score = cadence >= 10 ? 2 : 1
  else if (days < 365) score = 1
  else score = 0
  return {
    score,
    evidence: [
      `laatste commit op ${ctx.gitLog.lastCommitDate} (${days === null ? 'onbekend aantal dagen geleden' : Math.round(days * 10) / 10 + ' dagen geleden'})`,
      `${cadence} commits in de afgelopen 90 dagen, ${ctx.gitLog.totalCommits} commits totaal`,
      'gehanteerde drempels: <30 dagen = zeer actief, 30-180 = actief, 180-365 = vertragend, >365 (of geen git) = verlaten/stale'
    ],
    oordeel:
      score === 3
        ? 'Recente, frequente commit-activiteit toont aan dat het project actief onderhouden wordt.'
        : score === 2
          ? 'Er is recente activiteit met een redelijke frequentie, maar niet zo intensief dat de hoogste score gerechtvaardigd is.'
          : score === 1
            ? 'Recente activiteit is beperkt of sporadisch; het onderhoudsritme lijkt te vertragen.'
            : 'De laatste wijziging dateert van lang geleden en/of er is geen aantoonbare recente activiteit; het project lijkt verlaten.'
  }
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
    if (!scorer) throw new Error(`Geen actualiteit-scorer geregistreerd voor criterium "${criterion.id}"`)
    const { score, evidence, oordeel } = scorer(ctx)
    return { criterionId: criterion.id, score, max: 3, evidence, oordeel }
  })
  return { dimensionId: 'actualiteit', rows }
}
