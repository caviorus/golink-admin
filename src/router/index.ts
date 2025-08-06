import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../pages/dashboard/dashboard.vue"),
    },
    {
      path: "/item",
      name: "item",
      component: () => import("../pages/item/item.vue"),
    },
    {
      path: "/item/categories",
      name: "item-categories",
      component: () => import("../pages/item_category/item_category.vue"),
    },
    {
      path: "/item/subcategories",
      name: "item-subcategories",
      component: () => import("../pages/item_subcategory/item_subcategory.vue"),
    },
  ],
});

export default router;
