<script setup lang="ts">
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from 'reka-ui'

const props = defineProps<{ open: boolean; title: string; description: string }>()
const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()
</script>

<template>
  <DialogRoot :open="props.open" @open-change="(val: boolean) => emit('update:open', val)">
    <DialogPortal>
      <DialogOverlay class="bg-black/80 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent
        class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
      >
        <DialogTitle class="text-2xl font-medium">{{ props.title }}</DialogTitle>
        <DialogDescription class="my-4">{{ props.description }}</DialogDescription>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
