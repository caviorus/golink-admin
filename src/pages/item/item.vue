<script setup lang="ts">
import { h, onMounted, ref, nextTick } from "vue";
import DataTable from "@/components/datatable/datatable.vue";
import api from "@/utils/api";
import Swal from "sweetalert2";

const toast = useToast();

const columns = [
  {
    accessorKey: "name",
    header: "Item",
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
  id: "",
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
  <!-- modal start  -->
  <UModal v-model:open="addItemModal" title="Add Item" direction="left">
    <template #body>
      <div class="p-4">
        <form>
          <div class="flex flex-col gap-4">
            <UFormField label="Category" name="category" class="w-full">
              <USelect
                v-model="form.category_id"
                option-attribute="label"
                value-attribute="value"
                :items="categories"
                class="w-full"
                @change="getSubcategories"
              />
            </UFormField>
            <UFormField label="Subcategory" name="subcategory" class="w-full">
              <USelect
                v-model="form.subcategory_id"
                option-attribute="label"
                value-attribute="value"
                :items="subcategories"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Item Name" name="name" class="w-full">
              <UInput
                v-model="form.name"
                placeholder="Enter item name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Link" name="link" class="w-full">
              <UInput
                v-model="form.link"
                placeholder="Enter item link"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Type" name="type" class="w-full">
              <USelect
                v-model="form.type"
                :items="[
                  { label: 'Link', value: 'LINK' },
                  { label: 'Product', value: 'PRODUCT' },
                ]"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Description"
              name="description"
              class="w-full md:col-span-2"
            >
              <UTextarea
                v-model="form.description"
                placeholder="Enter item description"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Thumbnail"
              name="thumbnail"
              class="w-full md:col-span-2"
            >
              <UInput
                v-model="form.thumbnail"
                placeholder="Enter thumbnail URL"
                class="w-full"
              />
            </UFormField>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton color="error" @click="addItemModal = false">Close</UButton>
        <UButton
          color="primary"
          @click="parseInt(form.id) > 0 ? handlePut(form.id) : handlePost()"
          >Save</UButton
        >
      </div>
    </template>
  </UModal>

  <!-- modal end  -->

  <div>
    <h1 class="text-xl font-bold mb-4">Item List</h1>
    <UButton class="mb-2" icon="i-lucide-plus" @click="addItemModal = true"
      >Add Item</UButton
    >
    <DataTable ref="datatable" endpoint="/items" :columns="columns" />
  </div>
</template>
