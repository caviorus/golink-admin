import { nextTick, ref } from "vue";
import { defineStore } from "pinia";
import { api, apiFormData } from "@/utils/api";
import Swal from "sweetalert2";

const categories = ref([]);

export const useItemCategoryStore = defineStore("category", () => {
  const toast = useToast();
  const addItemModal = ref(false);
  const datatable = ref();
  const form = ref({
    id: null,
    name: ""
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

  const resetForm = () => {
    form.value = {
      id: null,
      name: "",
    };
  };

  function handleEdit(id: string) {
      api(`/categories/${id}`)
        .then(async (response) => {
          addItemModal.value = true;
          await nextTick();
          const category = response.data.data;
          form.value.id = category.id;
          form.value.name = category.name;  
        })
        .catch((error) => {
          console.error("Error fetching category for edit:", error);
          toast.add({
            title: "Error",
            description: "Failed to fetch category for editing.",
            color: "error",
          });
        });
    }
  
    function handleDelete(id: string) {
      Swal.fire({
        title: "Konfirmasi",
        text: "Apakah kamu yakin ingin menghapus category ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan!",
        cancelButtonText: "Batal",
        focusConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          api(`/categories/${id}`, {
            method: "DELETE",
          })
            .then((response) => {
              console.log("Category deleted:", response.data);
              toast.add({
                title: "Success",
                description: "Category deleted successfully.",
                color: "success",
              });
              datatable.value?.getData?.();
            })
            .catch((error) => {
              console.error("Error deleting category:", error);
              toast.add({
                title: "Error",
                description: "Failed to delete category.",
                color: "error",
              });
            });
        }
      });
    }

  return {
    categories,
    addItemModal,
    datatable,
    form,
    getCategories,
    resetForm,
    handleEdit,
    handleDelete
  };
});
