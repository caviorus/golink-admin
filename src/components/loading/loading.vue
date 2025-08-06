<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <div
    v-if="loading"
    class="fixed left-0 top-0 h-screen w-screen z-50 flex items-center justify-center bg-white dark:bg-gray-900"
  >
    <slot>
      <span class="text-xl font-semibold">Loading...</span>
    </slot>
  </div>
</template>
