<script setup lang="ts">
import type { Slot, TimeColumn } from '@/types/slotGrid'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'
import { useTimeMessage } from '@/composables/useTimeMessage'

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

const { getMessage, getMoveMessage } = useTimeMessage()

const getTimeMessage = () => {
  if (props.moveFrom.length === 0 || props.dropTargetSlots.length === 0) return ''
  return getMessage(props.dropTargetSlots, props.columns, getMoveMessage)
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
