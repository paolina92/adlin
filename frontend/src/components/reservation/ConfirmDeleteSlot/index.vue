<!--
  @component ConfirmDeleteSlot
  @description A component that displays a message for confirming a delete of a slot. Can be pass to a popover component.
-->
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
    <p class="text-center">Are you sure you want to delete this reservation?</p>
    <div class="flex justify-end space-x-2">
      <BaseButton label="Cancel" @click="cancelDelete" />
      <BaseButton label="Confirm" @click="confirmDelete" />
    </div>
  </div>
</template>
