import { nextTick, ref } from "vue";
import { defineStore } from "pinia";
import { api, apiFormData } from "@/utils/api";
import Swal from "sweetalert2";

export const useItemStore = defineStore("item", () => {
  const toast = useToast();
  const addItemModal = ref(false);
  const datatable = ref();
  const form = ref({
    id: null,
    name: "",
    category_id: undefined,
    subcategory_id: undefined,
    link: "",
    type: undefined,
    description: "",
    thumbnail: null,
    images: [],
  });
  const subcategories = ref([]);
  const images = ref<{ id: number; image: string }[]>([]);
  const thumbnail = ref("");

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
      .then(async (response) => {
        addItemModal.value = false;
        toast.add({
          title: "Success",
          description: "Item added successfully.",
          color: "success",
        });

        form.value.id = response.data.data.id;
        await apiFormData.post("/items/images", form.value).then((response) => {
          console.log("Item added with images:", response.data);
        });

        resetForm();
        refresh();
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
        form.value.category_id = item.subcategory.category.id;
        thumbnail.value = item.thumbnail;
        images.value = item.item_images || [];
        await getSubcategories();
        form.value.subcategory_id = item.subcategory.id;

        console.log("Item for edit:", images.value);
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
      focusConfirm: false,
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
            refresh();
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
    apiFormData
      .put(`/items/${id}`, form.value)
      .then(async (response) => {
        addItemModal.value = false;
        toast.add({
          title: "Success",
          description: "Item updated successfully.",
          color: "success",
        });

        await apiFormData.post("/items/images", form.value).then((response) => {
          console.log("Item added with images:", response.data);
        });

        resetForm();
        refresh();
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
      thumbnail: null,
      images: [],
    };
    images.value = [];
  }

  function handleDeleteImage(id: number) {
    setTimeout(async () => {
      await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah kamu yakin ingin menghapus gambar ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          api(`/items/images/${id}`, {
            method: "DELETE",
          })
            .then((response) => {
              console.log("Image deleted:", response.data);
              toast.add({
                title: "Success",
                description: "Image deleted successfully.",
                color: "success",
              });
              images.value = images.value.filter((img) => img.id !== id);
            })
            .catch((error) => {
              console.error("Error deleting image:", error);
              toast.add({
                title: "Error",
                description: "Failed to delete image.",
                color: "error",
              });
            });
        }
      });
      addItemModal.value = true;
    }, 100);
  }

  function handleDeleteThumbnail(id: number) {
    setTimeout(async () => {
      await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah kamu yakin ingin menghapus thumbnail ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          api(`/items/thumbnails/${id}`, {
            method: "DELETE",
          })
            .then((response) => {
              console.log("Thumbnail deleted:", response.data);
              toast.add({
                title: "Success",
                description: "Thumbnail deleted successfully.",
                color: "success",
              });
              thumbnail.value = "";
            })
            .catch((error) => {
              console.error("Error deleting thumbnail:", error);
              toast.add({
                title: "Error",
                description: "Failed to delete thumbnail.",
                color: "error",
              });
            });
        }
      });
      addItemModal.value = true;
    }, 100);
  }

  function setDatatableRef(ref: any) {
    datatable.value = ref;
  }

  function refresh() {
    datatable.value?.getData?.();
  }

  return {
    addItemModal,
    subcategories,
    datatable,
    form,
    images,
    thumbnail,
    getSubcategories,
    handlePost,
    handleEdit,
    handleDelete,
    handlePut,
    resetForm,
    handleDeleteImage,
    handleDeleteThumbnail,
    setDatatableRef,
    refresh
  };
});
