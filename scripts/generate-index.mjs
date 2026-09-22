import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.resolve(__dirname, '../src/components')
const outFile = path.resolve(__dirname, '../src/index.js')

const names = fs
  .readdirSync(componentsDir)
  .filter((f) => f.endsWith('.vue'))
  .sort()
  .map((f) => f.replace(/\.vue$/, ''))

let out = ''
for (const n of names) out += `import ${n} from './components/${n}.vue'\n`

out += `\nconst components = {\n${names.map((n) => `  ${n}`).join(',\n')}\n}\n\n`
out += `function createSimpleVueComponents() {
  return {
    install(app) {
      for (const [name, component] of Object.entries(components)) {
        app.component(name, component)
      }
    }
  }
}

export {
${names.map((n) => `  ${n}`).join(',\n')},
  createSimpleVueComponents
}

export default createSimpleVueComponents()
`

fs.writeFileSync(outFile, out)
console.log(`Wrote ${outFile} (${names.length} components)`)
