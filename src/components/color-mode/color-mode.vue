<script setup lang="ts">
import { computed } from "vue";
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.value = _isDark ? "dark" : "light";
  },
});
</script>

<template>
  <div v-if="colorMode" class="flex items-center gap-2">
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      @click="isDark = !isDark"
    />
  </div>
</template>
