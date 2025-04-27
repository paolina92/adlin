<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-grass11 bg-white shadow-sm border hover:bg-white/80 cursor-default focus:shadow-[0_0_0_2px]  focus:shadow-black dark:focus:shadow-green8 focus:outline-none "
      aria-label="Update dimensions"
    >
      <Icon icon="radix-icons:mixer-horizontal" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="rounded-lg p-5 w-[260px] bg-white shadow-sm border will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        <slot></slot>
        <PopoverClose
          class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-grass11 absolute top-[8px] right-[8px] hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
          aria-label="Close"
        >
          <Icon icon="radix-icons:cross-2" />
        </PopoverClose>
        <PopoverArrow class="fill-white stroke-gray" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>