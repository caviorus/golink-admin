<script setup lang="ts">
import { h, onMounted, ref, nextTick } from "vue";
import DataTable from "@/components/datatable/datatable.vue";
import api from "@/utils/api";
import Swal from "sweetalert2";
import FormItem from "./form_item.vue";
import { menuDataItems } from "@/constants/menu/item";
const menuItems = [menuDataItems.children];

const toast = useToast();

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
      resetForm();
      datatable.value?.getData?.();
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
          datatable.value?.getData?.();
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
      resetForm();
      datatable.value?.getData?.();
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

function resetForm() {
  form.value = {
    id: null,
    name: "",
    category_id: undefined,
    subcategory_id: undefined,
    link: "",
    type: undefined,
    description: "",
    thumbnail: "",
  };
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
    <UButton class="mb-2" icon="i-lucide-plus" @click="addItemModal = true; resetForm()" size="md"
      >Add Item</UButton
    >
    <DataTable
      ref="datatable"
      endpoint="/items"
      :columns="columns"
    />
  </div>
</template>
