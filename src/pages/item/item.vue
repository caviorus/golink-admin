<script setup lang="ts">
import { h, ref, onMounted, watch } from "vue";
import DataTable from "@/components/datatable/datatable.vue";
import { menuDataItems } from "@/constants/menu/item";
import { useItemStore } from "@/stores/item_store";
import FormItem from "./item_form.vue";
import { useItemCategoryStore } from "@/stores/item_category_store";

const item = useItemStore();
const category = useItemCategoryStore();
const datatable = ref();
const menuItems = [menuDataItems.children];
const columns = [
  {
    accessorKey: "name",
    sortable: true,
  },
  { accessorKey: "subcategory.category.name", header: "Category" },
  { accessorKey: "subcategory.name", header: "Subcategory" },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row }: any) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(
          "button",
          {
            class: "text-blue-500 hover:underline",
            onClick: () => item.handleEdit(row.original.id),
          },
          "Edit"
        ),
        h(
          "button",
          {
            class: "text-red-500 hover:underline",
            onClick: () => item.handleDelete(row.original.id),
          },
          "Delete"
        ),
      ]);
    },
  },
];
watch(datatable, (context) => {
  if (context) {
    item.setDatatableRef(context);
  }
});

onMounted(() => {
  category.get();
});
</script>

<template>
  <FormItem />
  <div>
    <h1 class="text-xl font-bold mb-4">Item List</h1>
    <UNavigationMenu :items="menuItems" content-orientation="horizontal" />
    <UButton
      class="mb-2"
      icon="i-lucide-plus"
      @click="
        item.addItemModal = true;
        item.resetForm();
      "
      size="md"
      >Add Item</UButton
    >
    <DataTable ref="datatable" endpoint="/items" :columns="columns" />
  </div>
</template>
