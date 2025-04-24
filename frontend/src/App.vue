<script lang="ts">
import { defineComponent, ref } from 'vue'
import SelectDropdown from '@/components/SelectDropdown'

export default defineComponent({
  name: 'App',
  components: {
    SelectDropdown,
  },
  setup() {
    const message = ref('Hello world Pauline')

    return {
      message,
    }
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-4xl">{{ message }}</div>
    <SelectDropdown />
  </div>
</template>
