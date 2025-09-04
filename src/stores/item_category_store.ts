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
    name: "",
  });

  async function get() {
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

  function edit(id: string) {
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

  function remove(id: string) {
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
            refresh();
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

  function post() {
    api
      .post("/categories", form.value)
      .then((response) => {
        addItemModal.value = false;
        toast.add({
          title: "Success",
          description: "Item added successfully.",
          color: "success",
        });
        resetForm();
        refresh();
      })
      .catch((error) => {
        console.error("Error adding category:", error);
        toast.add({
          title: "Error",
          description: "Failed to add category.",
          color: "error",
        });
      });
  }

  function put(id: string) {
    apiFormData
      .put(`/categories/${id}`, form.value)
      .then(async (response) => {
        addItemModal.value = false;
        toast.add({
          title: "Success",
          description: "categories updated successfully.",
          color: "success",
        });
        resetForm();
        refresh()
      })
      .catch((error) => {
        console.error("Error updating categories:", error);
        toast.add({
          title: "Error",
          description: "Failed to update categories.",
          color: "error",
        });
      });
  }

  function setDatatableRef(ref: any) {
    datatable.value = ref;
    console.log('datatable ref has been set');
  }

  function refresh() {
    console.log("refreshing...");
    datatable.value?.getData?.();
  }

  return {
    categories,
    addItemModal,
    datatable,
    form,
    get,
    resetForm,
    edit,
    remove,
    post,
    put,
    refresh,
    setDatatableRef
  };
});
