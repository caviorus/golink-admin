import type { NavigationMenuItem } from "@nuxt/ui";
import { menuDataItems } from "./menu/items";
import { ref } from "vue";

const menuItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/",
    },
    menuDataItems,
  ],
]);
const menuItemsBottom = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
]);
const menuItemsAppbar = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Account",
      icon: "i-lucide-user",
      to: "/logout",
    },
  ],
]);

export { menuItems, menuItemsBottom, menuItemsAppbar };
