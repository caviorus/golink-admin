<script setup lang="ts">
import { h, onMounted, ref, nextTick } from "vue";
import DataTable from "@/components/datatable/datatable.vue";
import api from "@/utils/api";
import Swal from "sweetalert2";
import FormItem from "./form_item.vue";
import { menuDataItems } from "@/constants/menu/item";
const menuItems = [menuDataItems.children];
import UButton from "@nuxt/ui/components/Button.vue";

const toast = useToast();

const sort = ref("name");
const sortDirection = ref<"asc" | "desc">("asc");

function handleSorting(column: any) {
  const isSorted = column.getIsSorted();
  sort.value = column.id;
  sortDirection.value = isSorted === "asc" ? "desc" : "asc";
}
const columns = [
  {
    accessorKey: "name",
    header: ({ column }: any) => {
      console.log(column);

      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Email",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => {
          handleSorting(column);
          column.toggleSorting(column.getIsSorted() === "asc");
          datatable.value?.getDataItem?.();
        },
      });
    },
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
            onClick: () => handleEdit(row.original.id),
          },
          "Edit"
        ),
        h(
          "button",
          {
            class: "text-red-500 hover:underline",
            onClick: () => handleDelete(row.original.id),
          },
          "Delete"
        ),
      ]);
    },
  },
];

const addItemModal = ref(false);
const categories = ref([]);
const subcategories = ref([]);
const datatable = ref();

type selectOption = {
  label: string;
  value: string | number;
};

const form = ref({
  id: null,
  name: "",
  category_id: undefined,
  subcategory_id: undefined,
  link: "",
  type: undefined,
  description: "",
  thumbnail: "",
});

async function getCategories() {
  try {
    await api.get("/categories").then((res) => {
      categories.value = res.data.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
  } catch (e) {
    console.error(e);
  }
}

async function getSubcategories() {
  try {
    const catId = form.value.category_id;
    await api.get(`/categories/${catId}/subcategories`).then((res) => {
      subcategories.value = res.data.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
  } catch (e) {
    console.error("Failed to fetch subcategories", e);
  }
}

function handlePost() {
  api
    .post("/items", form.value)
    .then((response) => {
      addItemModal.value = false;
      toast.add({
        title: "Success",
        description: "Item added successfully.",
        color: "success",
      });
      datatable.value?.getDataItem?.();
    })
    .catch((error) => {
      console.error("Error adding item:", error);
      toast.add({
        title: "Error",
        description: "Failed to add item.",
        color: "error",
      });
    });
}

function handleEdit(id: string) {
  api(`/items/${id}`)
    .then(async (response) => {
      addItemModal.value = true;
      await nextTick();
      const item = response.data.data;
      form.value.id = item.id;
      form.value.name = item.name;
      form.value.link = item.link;
      form.value.type = item.type;
      form.value.description = item.description;
      form.value.thumbnail = item.thumbnail;
      form.value.category_id = item.subcategory.category.id;
      await getSubcategories();
      form.value.subcategory_id = item.subcategory.id;

      console.log("Item for edit:", item);
    })
    .catch((error) => {
      console.error("Error fetching item for edit:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch item for editing.",
        color: "error",
      });
    });
}

function confirmDelete(id: string) {
  return new Promise((resolve) => {
    toast.add({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this item?",
      color: "warning",
      actions: [
        {
          label: "Cancel",
          color: "secondary",
          onClick: () => resolve(false),
        },
        {
          label: "Delete",
          color: "error",
          onClick: () => resolve(true),
        },
      ],
    });
  });
}

function handleDelete(id: string) {
  Swal.fire({
    title: "Konfirmasi",
    text: "Apakah kamu yakin ingin menghapus item ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, lanjutkan!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      api(`/items/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          console.log("Item deleted:", response.data);
          toast.add({
            title: "Success",
            description: "Item deleted successfully.",
            color: "success",
          });
          datatable.value?.getDataItem?.();
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          toast.add({
            title: "Error",
            description: "Failed to delete item.",
            color: "error",
          });
        });
    }
  });
}

function handlePut(id: string) {
  api
    .put(`/items/${id}`, form.value)
    .then((response) => {
      addItemModal.value = false;
      toast.add({
        title: "Success",
        description: "Item updated successfully.",
        color: "success",
      });
      datatable.value?.getDataItem?.();
    })
    .catch((error) => {
      console.error("Error updating item:", error);
      toast.add({
        title: "Error",
        description: "Failed to update item.",
        color: "error",
      });
    });
}

onMounted(() => {
  getCategories();
});
</script>

<template>
  <FormItem
    :form="form"
    :categories="categories"
    :getSubcategories="getSubcategories"
    :subcategories="subcategories"
    :handlePut="handlePut"
    :handlePost="handlePost"
    v-model:addItemModal="addItemModal"
  />

  <div>
    <h1 class="text-xl font-bold mb-4">Item List</h1>
    <UNavigationMenu :items="menuItems" content-orientation="horizontal" />
    <UButton class="mb-2" icon="i-lucide-plus" @click="addItemModal = true"
      >Add Item</UButton
    >
    <DataTable
      ref="datatable"
      :sort="sort"
      :sort-direction="sortDirection"
      endpoint="/items"
      :columns="columns"
    />
  </div>
</template>
