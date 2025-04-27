declare module '@/components/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/containers/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/pages/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/composables/*' {
  const composable: unknown
  export default composable
}

declare module '@/types/*' {
  const type: unknown
  export default type
}

declare module '@/stores/*' {
  const stores: unknown
  export default stores
}

declare module '@/constants/*' {
  const constants: unknown
  export default constants
}
