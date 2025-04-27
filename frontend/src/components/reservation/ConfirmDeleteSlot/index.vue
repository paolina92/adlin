<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const cancelDelete = () => emit('cancel')
const confirmDelete = () => emit('confirm')
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <p>Voulez-vous supprimer cette réservation ?</p>
    <div class="flex justify-end space-x-2">
      <BaseButton label="Annuler" @click="cancelDelete" />
      <BaseButton label="Confirmer" @click="confirmDelete" />
    </div>
  </div>
</template>
