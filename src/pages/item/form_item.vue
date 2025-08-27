<script setup lang="ts">
defineProps<{
  form: {
    id: number | null;
    name: string;
    category_id: undefined;
    subcategory_id: undefined;
    link: string;
    type: undefined;
    description: string;
    thumbnail: File | null;
    images: File[]; // Add this line to define images as an array of Files
  };
  categories: never[];
  getSubcategories: () => Promise<void>;
  subcategories: never[];
  handlePut: (id: string) => void;
  handlePost: () => void;
}>();
const addItemModal = defineModel<boolean>("addItemModal", { required: true });
</script>

<template>
  <UModal v-model:open="addItemModal"  title="Add Item" direction="left">
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
              <UFileUpload v-model="form.thumbnail" class="min-h-48 w-full"></UFileUpload>
            </UFormField>
            <UFormField label="Images" name="images" class="w-full md:col-span-2">
              <UFileUpload v-model="form.images" class="min-h-48 w-full" :multiple="true"></UFileUpload>
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
          @click="form.id !== null && parseInt(form.id as any) > 0 ? handlePut(String(form.id)) : handlePost()"
          >Save</UButton
        >
      </div>
    </template>
  </UModal>
</template>
