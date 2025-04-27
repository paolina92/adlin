<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
} from 'reka-ui'

const props = defineProps<{
  open?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<template>
  <PopoverRoot :open="props.open" @open-change="emit('update:open', $event)">
    <PopoverTrigger>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="rounded-lg p-5 w-[260px] bg-white shadow-sm border will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        <slot />
        <PopoverArrow class="fill-white stroke-gray" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
