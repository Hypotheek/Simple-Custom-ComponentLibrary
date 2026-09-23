// Generates one colocated Storybook CSF3 story file per component (ComponentName.stories.js
// next to ComponentName.vue). Storybook's Vue3 framework docgens props/emits/slots straight
// from the SFC for the "Docs" tab, so each generated story only needs to supply args: props
// with no declared default (or an unhelpful empty-array/object default) would otherwise render
// blank, so a small hand-curated overrides list below fills those in with realistic sample data,
// with every prop name verified against the real component source.
//
// Regenerate after adding or renaming components: npm run stories
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { categoryOf } from './categories.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(root, 'src', 'components')

// Extracts the object literal passed to defineProps({...}), matching braces so it
// works regardless of nesting. Returns null if there's no defineProps call.
function extractPropsLiteral(source) {
  const start = source.indexOf('defineProps(')
  if (start === -1) return null
  let i = source.indexOf('{', start)
  if (i === -1) return null
  let depth = 0
  const from = i
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return source.slice(from, i + 1)
    }
  }
  return null
}

// Real declared defaults only (never invented). Array/Object defaults are unwrapped
// from Vue's factory-function form (`default: () => [...]`) to their actual value.
function extractDefaults(literal) {
  let obj
  try {
    // eslint-disable-next-line no-new-func
    obj = new Function(`return (${literal})`)()
  } catch {
    return {} // a default with a non-literal expression (e.g. referencing another import); skip rather than guess
  }
  const args = {}
  for (const [prop, def] of Object.entries(obj)) {
    if (def == null || typeof def !== 'object' || !('default' in def)) continue
    const value = typeof def.default === 'function' ? def.default() : def.default
    if (value !== undefined) args[prop] = value
  }
  return args
}

// Hand-curated sample args for components whose real defaults are empty/absent and would
// otherwise render blank (charts with no data, option lists with no options, a required
// prop with no default). Every prop name here was checked against the component's actual
// defineProps before being added -- see the git history of this file for that check.
const OVERRIDES = {
  SBarChart: { data: [{ label: 'Jan', value: 420 }, { label: 'Feb', value: 680 }, { label: 'Mar', value: 540 }] },
  SLineChart: { data: [{ label: 'Jan', value: 420 }, { label: 'Feb', value: 680 }, { label: 'Mar', value: 540 }] },
  SDonutChart: { data: [{ label: 'Free', value: 420 }, { label: 'Pro', value: 210 }, { label: 'Enterprise', value: 95 }] },
  SHorizontalBar: { data: [{ label: 'Chrome', value: 640 }, { label: 'Safari', value: 320 }, { label: 'Firefox', value: 110 }] },
  SStackedBar: { segments: [{ label: 'Web', value: 540 }, { label: 'iOS', value: 320 }, { label: 'Android', value: 210 }] },
  SSparkline: { data: [3, 5, 4, 8, 7, 11, 9] },
  SScatterPlot: { points: [{ x: 1, y: 3, label: 'A' }, { x: 2, y: 7, label: 'B' }, { x: 4, y: 5, label: 'C' }] },
  SRadarChart: { data: [{ label: 'Speed', value: 80 }, { label: 'Power', value: 60 }, { label: 'Range', value: 90 }, { label: 'Skill', value: 50 }] },
  SHeatmap: { data: [[1, 4, 8, 3], [2, 6, 9, 5], [0, 3, 7, 2]], rowLabels: ['Mon', 'Tue', 'Wed'], colLabels: ['9a', '12p', '3p', '6p'] },
  SGauge: { value: 72, label: 'CPU', unit: '%' },
  SKpiCard: { label: 'Revenue', value: '$48.2k', delta: 12, trend: [3, 5, 4, 8, 7, 11] },
  SSelect: { modelValue: 'free', options: [{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }] },
  SAutocomplete: { modelValue: '', options: ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'] },
  SRadioGroup: { modelValue: 'a', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
  SCheckboxGroup: { modelValue: ['a'], options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
  SToggleGroup: { modelValue: 'day', options: [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }] },
  SRadio: { value: 'a', name: 'demo' },
  STagInput: { modelValue: ['vue', 'svg'] },
  SDescriptionList: { items: [{ term: 'Name', description: 'Ada' }, { term: 'Role', description: 'Engineer' }] },
  SAvatarGroup: { avatars: [{ name: 'Ada L' }, { name: 'Bob K' }, { name: 'Cy D' }, { name: 'Di E' }], max: 3 },
  STreeView: { nodes: [{ label: 'src', children: [{ label: 'index.js' }, { label: 'components', children: [{ label: 'SButton.vue' }] }] }, { label: 'package.json' }] },
  SVerticalSteps: { steps: [{ title: 'One', description: 'first' }, { title: 'Two' }, { title: 'Three' }], modelValue: 1 },
  SSteps: { steps: ['Cart', 'Shipping', 'Payment'], modelValue: 1 },
  STabs: { tabs: ['Overview', 'Billing'], modelValue: 'Overview' },
  SBreadcrumb: { items: ['Home', 'Library', 'SButton'] },
  SPricingCard: { title: 'Pro', price: '$19', features: ['Feature 1', 'Feature 2'] },
  SProfileCard: { name: 'Ada Lovelace', role: 'Engineer', bio: 'First programmer.' },
  SMediaCard: { title: 'Card title', subtitle: 'Subtitle' },
  SResult: { status: 'success', title: 'Done', subtitle: 'It worked' },
  SPagination: { modelValue: 1, pageCount: 8 },
  SRating: { modelValue: 3 },
  SProgress: { value: 60 },
  SMeter: { value: 45, label: 'Storage' },
  SRadialProgress: { value: 64 },
  SCounter: { value: 12840 },
  SCountdown: { target: Date.now() + 90061000 },
  SJsonViewer: { value: { name: 'lib', version: 1, tags: ['a', 'b'], ok: true } },
  SStat: { label: 'Users', value: '2,481' },
  STable: {
    columns: ['name', 'role'],
    rows: [{ name: 'Ada', role: 'Engineer' }, { name: 'Bob', role: 'Designer' }]
  },
  SNotificationBadge: { count: 120 },
  SSidebar: { modelValue: 'home', items: [{ label: 'Home', icon: '⌂', value: 'home' }, { label: 'Stats', icon: '▤', value: 'stats' }] },
  SBottomNav: { modelValue: 'home', items: [{ label: 'Home', icon: '⌂', value: 'home' }, { label: 'Stats', icon: '▤', value: 'stats' }] },
  SColorSwatches: { modelValue: '#3b82f6' }
}

// Components whose Default story needs actual slot content to show anything at all --
// a bare <SFlex /> with no children renders an empty, invisible box. args alone can't
// supply slot content in CSF3, so these get a render()-based story with real markup
// instead of an args-based one. Kept to the components that genuinely need it.
const SLOT_DEMOS = {
  SFlex: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div>`,
  SStack: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div>`,
  SHStack: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div>`,
  SWrap: Array.from({ length: 6 }, (_, i) => `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item ${i + 1}</div>`).join(''),
  SCenter: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">Centered</div>`,
  SSpread: `<strong>Title</strong><div style="border:1px dashed #9ca3af;padding:0.3em 0.8em">Action</div>`,
  SEqualCols: `<div style="border:1px dashed #9ca3af;padding:0.5em">Col A</div><div style="border:1px dashed #9ca3af;padding:0.5em">Col B</div><div style="border:1px dashed #9ca3af;padding:0.5em">Col C</div>`,
  SZStack: `<div style="width:120px;height:120px;background:#3b82f6"></div><div style="align-self:end;justify-self:end;padding:0.2em 0.5em;background:#ef4444;color:#fff;border-radius:999px">3</div>`,
  SGridItem: `Item`,
  SAutoGrid: Array.from({ length: 6 }, (_, i) => `<div style="border:1px dashed #9ca3af;padding:1em">Card ${i + 1}</div>`).join(''),
  SBox: `Boxed content`,
  SGap: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div>`,
  SPad: `<div style="border:1px dashed #9ca3af">Padded content</div>`,
  SInline: `<div style="border:1px dashed #9ca3af;padding:0.2em 0.6em">tag-a</div><div style="border:1px dashed #9ca3af;padding:0.2em 0.6em">tag-b</div>`,
  SAspectRatio: `<div style="width:100%;height:100%;background:#3b82f6"></div>`,
  SFill: `<div style="width:100%;height:100%;background:#3b82f6"></div>`,
  SSquare: `<div style="width:100%;height:100%;background:#3b82f6"></div>`,
  SPosition: `<div style="border:1px dashed #9ca3af;padding:0.5em 1em">Positioned</div>`,
  SOverlay: `<div style="width:100%;height:100%;background:rgba(59,130,246,0.35)"></div>`,
  SFullBleed: `<div style="padding:1em;background:#eef2ff;text-align:center">Full-bleed content</div>`,
  STruncate: `This is a long line of text that should be truncated with an ellipsis instead of wrapping`,
  SClamp: `This is a long paragraph of text meant to demonstrate multi-line clamping. It keeps going for a while so you can see where the clamp cuts it off and adds an ellipsis after the configured number of lines.`,
  SVisuallyHidden: `Announced to screen readers only`,
  SScrollArea: Array.from({ length: 8 }, (_, i) => `<p>Paragraph ${i + 1} of scrollable content.</p>`).join(''),
  SShowAbove: `Visible at or above the breakpoint`,
  SShowBelow: `Visible below the breakpoint`,
  SBorder: `<div style="padding:0.5em 1em">Bordered content</div>`,
  SRounded: `<div style="width:120px;height:80px;background:#3b82f6"></div>`,
  SColumns: `This text flows across multiple CSS columns. Add enough of it here so more than one column actually fills up, which is the only way to see the column layout doing anything at all.`,
  SSticky: `<div style="padding:0.5em 1em;background:#eef2ff">Sticky bar</div>`
}

function toLiteral(value, indent = '  ') {
  return JSON.stringify(value, null, 2).replace(/\n/g, `\n${indent}`)
}

function generate(file) {
  const name = path.basename(file, '.vue')
  const source = fs.readFileSync(file, 'utf8')
  const literal = extractPropsLiteral(source)
  const args = { ...(literal ? extractDefaults(literal) : {}), ...(OVERRIDES[name] ?? {}) }
  const category = categoryOf(name)
  const slot = SLOT_DEMOS[name]

  let body
  if (slot) {
    const argsLine = Object.keys(args).length ? `\n  args: ${toLiteral(args, '    ')},` : ''
    body = `export const Default = {${argsLine}\n  render: (args) => ({\n    components: { ${name} },\n    setup() {\n      return { args }\n    },\n    template: \`<${name} v-bind="args">${slot}</${name}>\`\n  })\n}\n`
  } else {
    body = Object.keys(args).length ? `export const Default = {\n  args: ${toLiteral(args)}\n}\n` : `export const Default = {}\n`
  }

  return `import ${name} from './${name}.vue'\n\nexport default {\n  title: '${category}/${name}',\n  component: ${name},\n  tags: ['autodocs']\n}\n\n${body}`
}

const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.vue')).sort()
let written = 0
for (const file of files) {
  const name = path.basename(file, '.vue')
  const out = path.join(componentsDir, `${name}.stories.js`)
  fs.writeFileSync(out, generate(path.join(componentsDir, file)))
  written++
}
console.log(`Generated ${written} story files in src/components/`)
