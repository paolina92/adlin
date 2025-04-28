<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

function onInput(event: Event) {
  emits('update:modelValue', (event.target as HTMLInputElement).value)
}

function onSearch() {
  emits('search', props.modelValue)
}
</script>

<template>
  <div class="relative">
    <Icon
      icon="radix-icons:magnifying-glass"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray pointer-events-none"
    />

    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 border border-gray rounded-lg text-base text-gblack placeholder-gray focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
      @input="onInput"
      @keyup.enter="onSearch"
    />
  </div>
</template>
