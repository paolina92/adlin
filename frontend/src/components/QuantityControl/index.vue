<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const quantity = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function increment() {
  if (props.max === undefined || quantity.value < props.max) {
    quantity.value += 1
  }
}

function decrement() {
  if (quantity.value > (props.min ?? 0)) {
    quantity.value -= 1
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="label" class="font-semibold">{{ label }}</div>
    <div class="flex items-center">
      <button
        type="button"
        class="px-3 py-1 rounded-l-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="quantity <= (props.min ?? 0)"
        @click="decrement"
      >
        -
      </button>

      <input
        v-model.number="quantity"
        type="number"
        :min="props.min ?? 0"
        :max="props.max"
        class="w-50 text-center border border-gray-300 px-2 py-1 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        class="px-3 py-1 rounded-r-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.max !== undefined && quantity >= props.max"
        @click="increment"
      >
        +
      </button>
    </div>
  </div>
</template>
