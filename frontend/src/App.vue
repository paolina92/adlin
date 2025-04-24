<script lang="ts">
import { defineComponent, ref } from 'vue'
import Button from './components/Button/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    Button
  },
  setup() {
    const message = ref('Hello world Pauline')
    
    return {
      message
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-4xl">{{ message }}</div>
    <div class="text-4xl">{{ message }}</div>
    <div>Hello</div>
    <Button />
  </div>
</template>
