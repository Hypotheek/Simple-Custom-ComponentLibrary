<template>
  <pre class="s-json"><code><span
    v-for="(tok, i) in tokens"
    :key="i"
    :class="`s-json__${tok.type}`"
  >{{ tok.text }}</span></code></pre>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [Object, Array, String, Number, Boolean],
    default: null
  }
})

const TOKEN = /("(?:\\.|[^"\\])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

const tokens = computed(() => {
  const json = JSON.stringify(props.value ?? null, null, 2) ?? 'null'
  return json
    .split(TOKEN)
    .filter((part) => part !== '')
    .map((part) => {
      let type = 'plain'
      if (/^"/.test(part)) type = /:$/.test(part) ? 'key' : 'string'
      else if (/^(true|false)$/.test(part)) type = 'bool'
      else if (part === 'null') type = 'null'
      else if (/^-?\d/.test(part)) type = 'number'
      return { text: part, type }
    })
})
</script>

<style scoped>
.s-json {
  margin: 0;
  padding: 1em;
  background: #111827;
  color: #e5e7eb;
  border-radius: 8px;
  font-size: 0.82em;
  line-height: 1.5;
  overflow-x: auto;
}
.s-json__key {
  color: #93c5fd;
}
.s-json__string {
  color: #86efac;
}
.s-json__number {
  color: #fcd34d;
}
.s-json__bool {
  color: #f9a8d4;
}
.s-json__null {
  color: #9ca3af;
}
</style>
