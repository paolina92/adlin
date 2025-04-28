<!--
  @component ConfirmCreateSlot
  @description A component that displays a message for confirming a create of a slot. Can be pass to a dialog component.
-->
<script setup lang="ts">
import type { Slot, TimeColumn } from '@/types/slotGrid'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'
import { CalendarDate } from '@internationalized/date'
import { useTimeMessage } from '@/composables/useTimeMessage'

const props = defineProps<{
  createDialogOpen: boolean
  createCandidate: Slot[]
  columns: TimeColumn[]
  selectedDate: CalendarDate
  cancelCreate: () => void
  confirmCreate: () => void
}>()

const { getMessage, getCreateMessage } = useTimeMessage()

const getTimeMessage = () => {
  return getMessage(props.createCandidate, props.columns, getCreateMessage, props.selectedDate)
}
</script>

<template>
  <Dialog
    :open="props.createDialogOpen"
    title="Create a reservation"
    :description="getTimeMessage()"
    @update:open="props.cancelCreate"
  >
    <div class="flex justify-end space-x-2">
      <BaseButton label="Cancel" @click="props.cancelCreate" />
      <BaseButton label="Create" @click="props.confirmCreate" />
    </div>
  </Dialog>
</template>
