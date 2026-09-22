<template>
  <table class="s-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <td v-for="col in columns" :key="col">{{ row[col] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.s-table {
  width: 100%;
  border-collapse: collapse;
}
.s-table th,
.s-table td {
  text-align: left;
  padding: 0.6em 0.8em;
  border-bottom: 1px solid #e5e7eb;
}
.s-table th {
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
}
</style>
