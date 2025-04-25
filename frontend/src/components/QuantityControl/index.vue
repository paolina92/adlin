<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  modelValue?: number
  defaultValue?: number
  min?: number
  max?: number
  label?: string
  onChange?: (value: number) => void
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const quantity = ref<number>(props.modelValue ?? props.defaultValue ?? props.min ?? 0)

watch(
  () => props.modelValue,
  newVal => {
    if (typeof newVal === 'number') {
      quantity.value = newVal
    }
  }
)

watch(quantity, newVal => {
  emit('update:modelValue', newVal)
  emit('change', newVal)
  if (props.onChange) props.onChange(newVal)
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

onMounted(() => {
  emit('change', quantity.value)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="label" class="font-semibold">{{ label }}</div>
    <div class="flex items-center">
      <button
        type="button"
        class="px-3 py-1 rounded-l-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition"
        @click="decrement"
      >
        -
      </button>

      <input
        v-model="quantity"
        type="number"
        class="w-50 text-center border border-gray-300 px-2 py-1 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :min="props.min ?? 0"
        :max="props.max"
      />

      <button
        type="button"
        class="px-3 py-1 rounded-r-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition"
        @click="increment"
      >
        +
      </button>
    </div>
  </div>
</template>
