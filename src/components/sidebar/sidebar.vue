<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core";
import { onMounted, ref } from "vue";

const props = defineProps({
  collapsed: Boolean,
  menu: null,
  bottom: null,
});
const emit = defineEmits(["update:collapsed"]);

const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
});
const mobile = breakpoints.smaller("md").value;
let drawer = ref(false);
defineExpose({
  sidebarToggle,
});

function sidebarToggle() {
  drawer.value = !drawer.value;
  emit("update:collapsed", drawer.value);
}

onMounted(() => {
  if (mobile) {
    emit("update:collapsed", true);
  }
});
</script>

<template>
  <div>
    <UDrawer v-model:open="drawer" direction="left" v-if="mobile">
      <template #content>
        <div
          class="flex flex-col px-3 py-2 h-screen bg-slate-900 light:bg-gray-50"
          @click="sidebarToggle"
        >
          <div class="h-12 rounded mb-2 flex items-center gap-2">
            <UAvatar
              size="sm"
              alt="profile-picture"
              src="https://d38we5ntdyxyje.cloudfront.net/858987/profile/GJQSELLC_avatar_medium_square.jpg"
            />
            <h1 v-if="!collapsed && !mobile">Albert Einstein</h1>
          </div>
          <UNavigationMenu
            :collapsed="collapsed && !mobile"
            :items="menu"
            orientation="vertical"
            :class="{
              'w-56': !collapsed && !mobile,
              'w-auto': collapsed && !mobile,
              'w-64': mobile,
            }"
            :tooltip="true"
          />
          <div class="mt-auto">
            <UNavigationMenu
              :collapsed="collapsed && !mobile"
              :items="bottom"
              orientation="vertical"
            />
          </div>
        </div>
      </template>
    </UDrawer>
    <div
      class="flex flex-col px-3 py-2 h-screen bg-slate-900 light:bg-gray-50"
      v-if="!mobile"
    >
      <div class="h-12 rounded mb-2 flex items-center gap-2">
        <UAvatar
          size="sm"
          alt="profile-picture"
          src="https://d38we5ntdyxyje.cloudfront.net/858987/profile/GJQSELLC_avatar_medium_square.jpg"
        />
        <h1 v-if="!collapsed">Albert Einstein</h1>
      </div>
      <UNavigationMenu
        :collapsed="collapsed"
        :items="menu"
        orientation="vertical"
        :class="{ 'w-56': !collapsed, 'w-auto': collapsed }"
      />
      <div class="mt-auto">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="bottom"
          orientation="vertical"
        />
      </div>
    </div>
  </div>
</template>
