#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { buildContext } from '../src/context.mjs'
import { aggregate } from '../src/aggregate.mjs'
import { renderMarkdown } from '../src/report/markdown.mjs'
import { renderJson } from '../src/report/json.mjs'
import { renderHtml } from '../src/report/html.mjs'
import { analyze as analyzeBeschikbaarheid } from '../src/analyzers/beschikbaarheid.mjs'
import { analyze as analyzeConsistentie } from '../src/analyzers/consistentie.mjs'
import { analyze as analyzeMachineleesbaarheid } from '../src/analyzers/machineleesbaarheid.mjs'
import { analyze as analyzeActualiteit } from '../src/analyzers/actualiteit.mjs'

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parseArgs(argv) {
  const args = { target: null, formats: [], outDir: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--json') args.formats.push('json')
    else if (a === '--html') args.formats.push('html')
    else if (a === '--md' || a === '--markdown') args.formats.push('markdown')
    else if (a === '--out') args.outDir = argv[++i]
    else if (!args.target) args.target = a
  }
  if (!args.formats.length) args.formats.push('markdown')
  return args
}

const args = parseArgs(process.argv.slice(2))
if (!args.target) fail('Gebruik: analyze.mjs <pad-naar-bibliotheek> [--json] [--html] [--md] [--out <map>]')

const rootDir = path.resolve(args.target)
if (!fs.existsSync(rootDir)) fail(`Pad bestaat niet: ${rootDir}`)

const ctx = buildContext(rootDir)
console.error(`Package-map: ${ctx.packageDir === '' ? '(root)' : ctx.packageDir ?? 'geen package.json gevonden'}`)
console.error(`Componenten: ${ctx.componentCount}; niet meegeteld: ${ctx.excludedNonComponentFiles.join(', ') || 'geen'}`)
if (ctx.gitLog === null) console.error('Geen git-geschiedenis gevonden: cellen die daarvan afhangen worden n.v.t. en tellen niet mee.')
const dimensionResults = [
  analyzeBeschikbaarheid(ctx),
  analyzeConsistentie(ctx),
  analyzeMachineleesbaarheid(ctx),
  analyzeActualiteit(ctx)
]
const matrix = aggregate(dimensionResults)
console.error(`Totaal: ${matrix.totalScore} / ${matrix.totalMax} (${matrix.nvtCells} cel(len) n.v.t.)`)

const meta = {
  name: ctx.packageJson?.name || path.basename(rootDir),
  rootDir,
  detectedFramework: ctx.detectedFramework,
  componentCount: ctx.componentCount,
  generatedAt: new Date().toISOString()
}

const renderers = { markdown: [renderMarkdown, 'md'], json: [renderJson, 'json'], html: [renderHtml, 'html'] }

for (const format of args.formats) {
  const [render, ext] = renderers[format]
  const output = render(matrix, meta)
  if (args.outDir) {
    fs.mkdirSync(args.outDir, { recursive: true })
    const file = path.join(args.outDir, `architectuuranalyse.${ext}`)
    fs.writeFileSync(file, output)
    console.error(`Geschreven: ${file}`)
  } else {
    console.log(output)
  }
}
