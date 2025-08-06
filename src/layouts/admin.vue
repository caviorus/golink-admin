<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import ColorMode from "@/components/color-mode/color-mode.vue";
import Sidebar from "@/components/sidebar/sidebar.vue";
import { menuItems, menuItemsBottom, menuItemsAppbar } from "@/constants/menu";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useCookies } from "@vueuse/integrations/useCookies";

const route = useRoute();
const router = useRouter();
const cookies = useCookies();

const activePath = computed(() => {
    const path = route.path;
    const all = [
        ...(menuItems.value ?? menuItems),
        ...(menuItemsBottom.value ?? menuItemsBottom),
        ...(menuItemsAppbar.value ?? menuItemsAppbar),
    ].flat() as NavigationMenuItem[];

    return all.find((i) => i.to === path);
});

const sidebar = ref();
const collapsed = ref(false);
function sidebarToggle() {
    sidebar.value?.sidebarToggle();
}
function handleSignOut() {
    cookies.remove("token");
    router.push("/auth/signin");
}

</script>
<template>
  <div class="flex min-h-screen bg-slate-950 light:bg-white">
      <Sidebar
        ref="sidebar"
        :menu="menuItems"
        :bottom="menuItemsBottom"
        :collapsed="collapsed"
        @update:collapsed="collapsed = $event"
      />
    <div class="w-full">
      <div
        class="flex border-b border-slate-800 light:border-slate-200 px-4 py-2"
      >
        <div class="flex flex-row justify-center items-center gap-2">
          <UButton
            :icon="
              !collapsed
                ? 'i-lucide-panel-right-open'
                : 'i-lucide-panel-left-open'
            "
            size="lg"
            class="flex items-center justify-center"
            variant="ghost"
            @click="sidebarToggle()"
          >
          </UButton>
          <h1 class="text-lg font-bold text-slate-200 light:text-slate-900">
            {{ activePath?.label }}
          </h1>
        </div>
        <div class="flex items-center ml-auto">
          <ColorMode>Color Mode</ColorMode>
          <UButton class="ml-4" variant="ghost" @click="handleSignOut()">
            Logout
          </UButton>
        </div>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
