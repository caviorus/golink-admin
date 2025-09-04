<script setup lang="ts">
import { useItemCategoryStore } from "@/stores/item_category_store";
const category = useItemCategoryStore();
</script>

<template>
    <UModal v-model:open="category.addItemModal" title="Add Item" direction="left">
    <template #body>
      <div class="p-4">
        <form>
          <div class="flex flex-col gap-4">
            <UFormField label="Item Name" name="name" class="w-full">
              <UInput
                v-model="category.form.name"
                placeholder="Enter item name"
                class="w-full"
              />
            </UFormField>
            </div>
          </form>
          </div>
        </template>
        <template #footer>
          <div class="w-full flex justify-end gap-2">
          <UButton color="error" @click="category.addItemModal = false">Close</UButton>
          <UButton
            color="primary"
            @click="
            category.form.id !== null && parseInt(category.form.id as any) > 0
              ? category.put(String(category.form.id))
              : category.post()
            "
            >Save</UButton
          >
          </div>
        </template>
  
      </UModal>
</template>