<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
} from 'reka-ui'

const props = defineProps<{
  options: string[]
  modelValue?: string
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

function clearSelection() {
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div class="flex flex-col gap-2 relative">
    <div v-if="label" class="font-semibold">{{ label }}</div>

    <div class="flex items-center gap-2">
      <SelectRoot
        :model-value="props.modelValue"
        @update:model-value="emit('update:modelValue', $event)"
      >
        <SelectTrigger
          class="inline-flex min-w-65 items-center justify-between rounded-lg px-4 text-sm h-[35px] gap-2 bg-white text-black border shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <SelectValue :placeholder="props.placeholder ?? 'Select an option...'" />
          <Icon icon="radix-icons:chevron-down" class="w-4 h-4" />
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            class="min-w-65 bg-white rounded-lg border border-brand shadow-sm z-50"
            :side-offset="5"
          >
            <SelectViewport class="p-1">
              <SelectItem
                v-for="(option, index) in props.options"
                :key="index"
                :value="option"
                class="text-sm text-black px-3 py-1.5 rounded-md select-none cursor-pointer hover:bg-green5 data-[highlighted]:bg-green9 data-[highlighted]:text-white"
              >
                <SelectItemText>{{ option }}</SelectItemText>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>

      <!-- Clear Button -->
      <button
        v-if="props.modelValue"
        @click="clearSelection"
        class="absolute -right-12 text-sm text-black hover:underline focus:outline-none"
      >
        Clear
      </button>
    </div>
  </div>
</template>
