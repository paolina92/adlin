<script setup lang="ts">
import type { Slot, TimeColumn } from '@/types/interfaces'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'

const props = defineProps<{
  moveDialogOpen: boolean
  moveFrom: Slot[]
  dropTargetSlots: Slot[]
  columns: TimeColumn[]
  cancelMove: () => void
  confirmMove: () => void
}>()

const emit = defineEmits<{
  'update:moveDialogOpen': [value: boolean]
}>()

const getTimeMessage = () => {
  if (props.moveFrom.length === 0 || props.dropTargetSlots.length === 0) return ''
  const startColumn = props.columns.find(col => col.id === props.dropTargetSlots[0].columnId)
  const endColumn = props.columns.find(col => col.id === props.dropTargetSlots[props.dropTargetSlots.length - 1].columnId)
  if (!startColumn || !endColumn) return ''
  return `Move reservation to ${startColumn.label} - ${endColumn.label}?`
}
</script>

<template>
  <Dialog
    :open="props.moveDialogOpen"
    title="Change your reservation"
    :description="getTimeMessage()"
    @update:open="value => emit('update:moveDialogOpen', value)"
  >
    <div class="flex justify-end space-x-2">
      <BaseButton label="Cancel" @click="props.cancelMove" />
      <BaseButton label="Move" @click="props.confirmMove" />
    </div>
  </Dialog>
</template>
