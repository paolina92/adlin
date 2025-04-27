<script setup lang="ts">
defineProps<{
  label: string
  onClick: () => void
}>()
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-white text-sm font-medium hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 active:scale-95 transition"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>
