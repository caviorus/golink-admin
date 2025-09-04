<script setup lang="ts">
import { h, watch, ref } from "vue";
import DataTable from "@/components/datatable/datatable.vue";
import { menuDataItems } from "@/constants/menu/item";
import { useItemCategoryStore } from "@/stores/item_category_store";
import FormCategory from "./item_category_form.vue";

const category = useItemCategoryStore();
const menuItems = [menuDataItems.children];
const datatable = ref();
const columns = [
  {
    accessorKey: "name",
    sortable: true,
  },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row }: any) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(
          "button",
          {
            class: "text-blue-500 hover:underline",
            onClick: () => category.edit(row.original.id),
          },
          "Edit"
        ),
        h(
          "button",
          {
            class: "text-red-500 hover:underline",
            onClick: () => category.remove(row.original.id),
          },
          "Delete"
        ),
      ]);
    },
  },
];

watch(datatable, (context) => {
  if (context) {
    category.setDatatableRef(context);
  }
});

</script>

<template>
  <FormCategory />
  <div>
    <h1 class="text-xl font-bold mb-4">Item List</h1>
    <UNavigationMenu :items="menuItems" content-orientation="horizontal" />
    <UButton
      class="mb-2"
      icon="i-lucide-plus"
      @click="
        category.addItemModal = true;
        category.resetForm();
      "
      size="md"
      >Add Category</UButton
    >
    <UButton
      class="mb-2 ml-2"
      icon="i-lucide-refresh-cw"
      @click="category.refresh"
      size="md"
      >Refresh</UButton
    >
    <DataTable
      ref="datatable"
      endpoint="/categories"
      :columns="columns"
    />
  </div>
</template>
