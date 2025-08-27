<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import { api } from "@/utils/api";
import UButton from "@nuxt/ui/components/Button.vue";

const sort = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

// ✅ Define your own TableColumn type
type TableColumn = {
  accessorKey: string;
  header?: any;
  sortable?: boolean;
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
  getData,
});

async function getData() {
  try {
    await api
      .get(props.endpoint, {
        params: {
          start: start.value,
          limit: limit.value,
          sort: sort.value,
          sortDirection: sortDirection.value,
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
  getData();
}

function updateLimit(newLimit: number) {
  limit.value = newLimit;
  start.value = 0;
  page.value = 1;
  getData();
}

function onLimitChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  updateLimit(Number(value));
}

onMounted(() => {
  getData();
});

const sequenceColumn: TableColumn = {
  accessorKey: "sequence",
  header: "#",
  cell: ({ row }) => (start.value + row.index + 1).toString(),
};

const displayColumns = computed(() => [sequenceColumn, ...props.columns]);
const formatedColumns = computed(() => {
  return displayColumns.value.map((col) => {
    return {
      ...col,
      header: col.sortable
        ? ({ column }: any) => createSortableHeader({ column })
        : col.header || col.accessorKey,
    };
  });
});

function createSortableHeader({ column }: any) {
  console.log(column);
  const isSorted = column.getIsSorted();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label: column.columnDef.accessorKey,
    icon: isSorted
      ? isSorted === "asc"
        ? "i-lucide-arrow-up-narrow-wide"
        : "i-lucide-arrow-down-wide-narrow"
      : "i-lucide-arrow-up-down",
    class: "-mx-2.5",
    onClick: () => {
      handleSorting(column);
      column.toggleSorting(column.getIsSorted() === "asc");
      getData();
    },
  });
}

function handleSorting(column: any) {
  const isSorted = column.getIsSorted();
  sort.value = column.id;
  sortDirection.value = isSorted === "asc" ? "desc" : "asc";
}
</script>

<template>
  <div>
    <div class="border border-default rounded">
      <!-- Replace with your own table component -->

      <UTable
        :data="items"
        :sorting-options="{
          manualSorting: true,
        }"
        :columns="formatedColumns"
        :striped="true"
        :hoverable="true"
      />
    </div>

    <div
      class="mt-4 flex flex-col md:flex-row justify-between items-center gap-2"
    >
      <div
        class="flex items-center w-full justify-between md:w-fit md:justify-start gap-2"
      >
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
