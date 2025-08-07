<script setup lang="ts">
import Admin from "@/layouts/admin.vue";
import { computed } from "vue";
import { useAuth } from "./stores/auth";

const authenticated = computed(() => {
  return useAuth().token !== null;
});
</script>

<template>
  <UApp>
    <Admin v-if="authenticated">
      <RouterView />
    </Admin>
    <div v-if="!authenticated">
      <RouterView />
    </div>
  </UApp>
</template>
