<template>
  <label class="s-file-upload">
    <input type="file" class="s-file-upload__input" @change="$emit('change', $event.target.files)" />
    <span>{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Choose file'
  }
})
defineEmits(['change'])
</script>

<style scoped>
.s-file-upload {
  display: inline-flex;
  align-items: center;
  padding: 0.5em 1em;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
}
.s-file-upload__input {
  display: none;
}
</style>
