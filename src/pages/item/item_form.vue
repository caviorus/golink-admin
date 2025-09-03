<script setup lang="ts">
import { useItemCategoryStore } from "@/stores/item_category_store";
import { useItemStore } from "@/stores/item_store";
const item = useItemStore();
const category = useItemCategoryStore();
</script>

<template>
    <UModal v-model:open="item.addItemModal" title="Add Item" direction="left">
    <template #body>
      <div class="p-4">
        <form>
          <div class="flex flex-col gap-4">
            <UFormField label="Category" name="category" class="w-full">
              <USelect
                v-model="item.form.category_id"
                option-attribute="label"
                value-attribute="value"
                :items="category.categories"
                class="w-full"
                @change="item.getSubcategories"
              />
            </UFormField>
            <UFormField label="Subcategory" name="subcategory" class="w-full">
              <USelect
                v-model="item.form.subcategory_id"
                option-attribute="label"
                value-attribute="value"
                :items="item.subcategories"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Item Name" name="name" class="w-full">
              <UInput
                v-model="item.form.name"
                placeholder="Enter item name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Type" name="type" class="w-full">
              <USelect
                v-model="item.form.type"
                :items="[
                  { label: 'Link', value: 'LINK' },
                  { label: 'Product', value: 'PRODUCT' },
                ]"
                class="w-full"
              />
            </UFormField>
            <UFormField
              v-if="item.form.type === 'LINK'"
              label="Link"
              name="link"
              class="w-full"
            >
              <UInput
              v-model="item.form.link"
              placeholder="Enter item link"
              class="w-full"
              />
            </UFormField>
            <UFormField
              label="Description"
              name="description"
              class="w-full md:col-span-2"
            >
              <UTextarea
              v-model="item.form.description"
              placeholder="Enter item description"
              class="w-full"
              />
            </UFormField>
            <UFormField
              label="Thumbnail"
              name="thumbnail"
              class="w-full md:col-span-2"
            >
              <template v-if="item.thumbnail.length > 0">
              <div class="w-full h-40 overflow-hidden rounded my-2 relative">
                <img :src="item.thumbnail" alt="Thumbnail" class="w-full h-auto" />
                <UButton
                icon="i-lucide-trash"
                size="sm"
                class="absolute right-1 top-1 p-1 bg-red-500 text-white rounded"
                @click="
                  item.addItemModal = false;
                  if (typeof item.form.id === 'number' && item.form.id !== null) {
                  item.handleDeleteThumbnail(item.form.id);
                  }
                "
                ></UButton>
              </div>
              </template>
              <UFileUpload
              v-model="item.form.thumbnail"
              class="min-h-48 w-full"
              ></UFileUpload>
            </UFormField>
            <template v-if="item.images.length > 0">
              <div class="flex flex-col gap-2">
              <div class="font-semibold">Uploaded Images:</div>
              <div class="flex flex-wrap gap-2">
                <div
                class="relative"
                v-for="(image, index) in item.images"
                :key="index"
                >
                <img
                  :src="image.image"
                  alt="Uploaded Image"
                  class="w-24 h-24 object-cover rounded"
                />
                <UButton
                  icon="i-lucide-trash"
                  size="sm"
                  class="absolute right-1 top-1 p-1 bg-red-500 text-white rounded"
                  @click="
                  item.addItemModal = false;
                  item.handleDeleteImage(image.id);
                  "
                >
                </UButton>
                </div>
              </div>
              </div>
            </template>
            <UFormField
              label="Images"
              name="images"
              class="w-full md:col-span-2"
            >
              <UFileUpload
              v-model="item.form.images"
              class="min-h-48 w-full"
              :multiple="true"
              ></UFileUpload>
            </UFormField>
            </div>
          </form>
          </div>
        </template>
        <template #footer>
          <div class="w-full flex justify-end gap-2">
          <UButton color="error" @click="item.addItemModal = false">Close</UButton>
          <UButton
            color="primary"
            @click="
            item.form.id !== null && parseInt(item.form.id as any) > 0
              ? item.handlePut(String(item.form.id))
              : item.handlePost()
            "
            >Save</UButton
          >
          </div>
        </template>
  
      </UModal>
</template>