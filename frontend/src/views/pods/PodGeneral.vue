<script lang="ts" setup>
import { ChevronRightIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { DeletePod, GetPodEvents } from "../../../wailsjs/go/main/App";
import { v1 } from "../../../wailsjs/go/models";
import { useGlobalStore } from "../../stores/global";
import { getMetadata } from "../../utils/k8s";
import { useDialogStore } from "../../stores/dialog";
import { useAsyncState } from "@vueuse/core";
import { getTimeAgo } from "../../utils/date";

const props = defineProps<{
  selectedResource: v1.Pod;
  onClosePodView: () => void;
}>();

const store = useGlobalStore();
const { showDialog } = useDialogStore();
const metadata = computed(() => getMetadata(props.selectedResource)!);

function handleDelete() {
  if (!store.activeContext || !metadata.value.namespace || !props.selectedResource) return;
  showDialog({
    title: `Delete pod?`,
    message: `Are you sure you want to delete the following pod: ${metadata.value.name}? This action cannot be undone.`,
    onConfirm: async () => {
      if (!store.activeContext || !metadata.value.namespace || !props.selectedResource) return;
      await DeletePod(store.activeContext.name, metadata.value.namespace, metadata.value.name);
      props.onClosePodView();
    },
  });
}

async function fetchData() {
  if (!store.activeContext || !metadata.value.namespace || !props.selectedResource) return;

  const result = await GetPodEvents(store.activeContext.name, metadata.value.namespace, metadata.value.name);
  return result.items;
}

const { state, isLoading, execute } = useAsyncState(fetchData, null, { immediate: true, resetOnExecute: false });

const timeout = ref<number>();
onMounted(() => {
  timeout.value = setInterval(execute, 1000);
});
onUnmounted(() => {
  clearInterval(timeout.value);
});
</script>

<template>
  <div class="mt-4"></div>

  <div class="mt-4"></div>

  <div class="flex justify-end">
    <div>
      <button class="btn btn-outline btn-error btn-sm mr-2" @click="handleDelete">
        <TrashIcon class="h-5 w-5" />
        <span>Delete</span>
      </button>
    </div>
  </div>

  <div class="mt-4"></div>
  <!-- 
  <div class="">Labels</div>
  <div class="inline-flex mt-1 flex-wrap">
    <div
      class="px-2 py-0 rounded-md bg-neutral-700 text-sm mr-2 mb-2 whitespace-nowrap"
      v-for="(value, key) in metadata.labels"
    >
      {{ key }}: {{ value }}
    </div>
  </div> -->

  <div class="mt-4"></div>

  <div v-if="isLoading && !state" class="flex justify-center">
    <span class="loading loading-ring loading-lg h-40"></span>
  </div>
  <table class="table table-xs" v-else>
    <thead>
      <tr>
        <th>Events</th>
        <th>Reason</th>
        <th>Last seen</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in state" class="cursor-pointer hover:bg-base-300">
        <td>
          <span class="text-sm">{{ item.message }}</span>
        </td>
        <td>
          <span class="font-semibold">{{ item.reason }}</span>
        </td>
        <td>
          <span class="text-sm">{{ getTimeAgo(item.lastTimestamp) }}</span>
        </td>
        <td>
          <span class="text-sm">{{ item.count }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table-wrapper {
  margin-left: -6px;
}

.loading-spinner {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
