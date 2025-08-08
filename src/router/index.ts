import { useAuth } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
const signinRoute = {
  path: "/signin",
  name: "signin",
  component: () => import("../pages/auth/signin.vue"),
};

const appRoutes = [
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
  {
    path: "/settings",
    name: "settings",
    component: () => import("../pages/settings/settings.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    signinRoute,
    ...appRoutes
  ],
});

router.beforeEach((to, from) => {
  const authenticated = (useAuth().token !== null);

  if (!authenticated && to.name !== "signin") {
    return { name: "signin" };
  }
});

export default router;
