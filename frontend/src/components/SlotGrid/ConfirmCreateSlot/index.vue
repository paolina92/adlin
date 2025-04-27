<script setup lang="ts">
import type { Slot } from '@/types/interfaces'
import Dialog from '@/components/Dialog'
import BaseButton from '@/components/BaseButton'

const props = defineProps<{
  createDialogOpen: boolean
  createCandidate: Slot[]
  cancelCreate: () => void
  confirmCreate: () => void
}>()
</script>

<template>
  <Dialog
    :open="props.createDialogOpen"
    title="Créer une réservation"
    :description="`Créer cette réservation de ${props.createCandidate.length} créneau${props.createCandidate.length > 1 ? 'x' : ''} ?`"
    @update:open="props.cancelCreate"
  >
    <div class="flex justify-end space-x-2">
      <BaseButton label="Annuler" @click="props.cancelCreate" />
      <BaseButton label="Créer" @click="props.confirmCreate" />
    </div>
  </Dialog>
</template>
