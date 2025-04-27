<script setup lang="ts">
import type { Slot } from '@/types/interfaces'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'

const props = defineProps<{
  moveDialogOpen: boolean
  moveFrom: Slot[]
  cancelMove: () => void
  confirmMove: () => void
}>()

const emit = defineEmits<{
  'update:moveDialogOpen': [value: boolean]
}>()
</script>

<template>
  <Dialog
    :open="props.moveDialogOpen"
    title="Déplacer la réservation"
    :description="`Déplacer le groupe de ${props.moveFrom.length} créneau${props.moveFrom.length > 1 ? 'x' : ''} ?`"
    @update:open="value => emit('update:moveDialogOpen', value)"
  >
    <div class="flex justify-end space-x-2">
      <BaseButton label="Annuler" @click="props.cancelMove" />
      <BaseButton label="Déplacer" @click="props.confirmMove" />
    </div>
  </Dialog>
</template>
