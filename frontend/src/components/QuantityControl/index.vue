<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: number
  onChange?: (value: number) => void
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const quantity = ref<number>(props.modelValue ?? 0)

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
  if (props.onChange) props.onChange(newVal)
})

function increment() {
  quantity.value += 1
}

function decrement() {
  if (quantity.value > 0) {
    quantity.value -= 1
  }
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <button
        type="button"
        @click="decrement"
        class="px-3 py-1 rounded-l-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition"
      >
        -
      </button>

      <input
        type="number"
        v-model="quantity"
        class="w-50 text-center border border-gray-300 px-2 py-1 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min="0"
      />

      <button
        type="button"
        @click="increment"
        class="px-3 py-1 rounded-r-md bg-brand text-white text-sm hover:bg-brand-hover active:scale-95 transition"
      >
        +
      </button>
    </div>
  </div>
</template>
