<script setup lang="ts">
import type { Slot, TimeColumn } from '@/types/slotGrid'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'
import { CalendarDate } from '@internationalized/date'

const props = defineProps<{
  createDialogOpen: boolean
  createCandidate: Slot[]
  columns: TimeColumn[]
  selectedDate: CalendarDate
  cancelCreate: () => void
  confirmCreate: () => void
}>()

const getTimeMessage = () => {
  if (props.createCandidate.length === 0) return ''
  const startColumn = props.columns.find(col => col.id === props.createCandidate[0].columnId)
  const endColumn = props.columns.find(
    col => col.id === props.createCandidate[props.createCandidate.length - 1].columnId
  )
  if (!startColumn || !endColumn) return ''
  const month = props.selectedDate.month
  const day = props.selectedDate.day
  const year = props.selectedDate.year
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `Create a reservation on ${monthNames[month - 1]} ${day}, ${year} from ${startColumn.label} to ${endColumn.label}?`
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
