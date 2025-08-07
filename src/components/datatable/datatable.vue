<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/utils/api";

// ✅ Define your own TableColumn type
type TableColumn = {
  accessorKey: string;
  header: string;
  cell?: (props: any) => any; // Optional custom cell renderer
};

const props = defineProps<{
  endpoint: string;
  columns: TableColumn[];
  limitOptions?: number[];
}>();

const emit = defineEmits<{
  (e: "fetched", data: any[]): void;
}>();

const items = ref<any[]>([]);
const totalItems = ref(0);
const limitOptions = ref([10, 20, 50, 100]);
const limit = ref(10);
const start = ref(0);
const page = ref(1);

defineExpose({
  updateStart,
  updateLimit,
  getDataItem,
});

async function getDataItem() {
  try {
    await api.get(props.endpoint, {
      params: {
        start: start.value,
        limit: limit.value,
      },
    })
    .then((response) => {
      if (response.data.data.items) {
        items.value = response.data.data.items;
        totalItems.value = response.data.data.total || 0;
      } else {
        items.value = [];
        totalItems.value = 0;
      }
    });

    emit("fetched", items.value);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

function updateStart(newStart: number) {
  start.value = newStart;
  getDataItem();
}

function updateLimit(newLimit: number) {
  limit.value = newLimit;
  start.value = 0;
  page.value = 1;
  getDataItem();
}

function onLimitChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  updateLimit(Number(value));
}

onMounted(() => {
  getDataItem();
});

const sequenceColumn: TableColumn = {
  accessorKey: "sequence",
  header: "#",
  cell: ({ row }) => (start.value + row.index + 1).toString(),
};

const displayColumns = computed(() => [sequenceColumn, ...props.columns]);
</script>

<template>
  <div>
    <div class="border rounded">
      <!-- Replace with your own table component -->
       
      <UTable
        :data="items"
        :columns="displayColumns"
        :striped="true"
        :hoverable="true"
      />
    </div>

    <div class="mt-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <div class="flex items-center w-full justify-between md:w-fit md:justify-start gap-2">
        <USelect
          v-model="limit"
          :items="limitOptions"
          label="Items per page"
          @change="onLimitChange"
        />
        <div>{{ items.length }} from {{ totalItems }} Data</div>
      </div>

      <!-- Replace with your own pagination component -->
      <UPagination
        v-if="totalItems > 0"
        :total="totalItems"
        :per-page="limit"
        :current-page="page"
        @update:page="
          (p: number) => {
            updateStart((p - 1) * limit);
            page = p;
          }
        "
      />
    </div>
  </div>
</template>
