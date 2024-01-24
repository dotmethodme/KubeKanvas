<script lang="ts" setup>
import { ArrowPathIcon, ArrowUpRightIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useAsyncState } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { GetPodsByDeployment, RestartDeployment } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import { useGlobalStore } from "../stores/global";
import { getMetadata } from "../utils/k8s";
import PodTable from "./PodTable.vue";

const props = defineProps<{
  selectedResource: v1.Deployment;
}>();

const store = useGlobalStore();
const metadata = computed(() => getMetadata(props.selectedResource)!);

function handleRestart() {
  if (!store.activeContext || !metadata.value.namespace || !props.selectedResource) return;
  RestartDeployment(store.activeContext.name, metadata.value.namespace, metadata.value.name);
}

async function fetchPods() {
  if (!store.activeContext || !metadata.value.namespace || !props.selectedResource) return;
  const selector = props.selectedResource.spec?.selector;
  if (!selector) return;

  const result = await GetPodsByDeployment(store.activeContext.name, metadata.value.namespace, selector);
  return result.items;
}

const interval = ref<number>();

const { state: pods, isLoading, execute } = useAsyncState(fetchPods, [], { resetOnExecute: false });

onMounted(async () => {
  interval.value = setInterval(execute, 2000);
});

onUnmounted(() => clearInterval(interval.value));
</script>

<template>
  <div class="mt-4"></div>

  <div class="mt-4"></div>

  <div class="flex justify-end">
    <div>
      <button class="btn btn-outline btn-primary btn-sm mr-2" @click="handleRestart">
        <ArrowPathIcon class="h-5 w-5" />
        <span>Restart</span>
      </button>
      <button class="btn btn-outline btn-primary btn-sm mr-2">
        <ArrowUpRightIcon class="h-5 w-5" />
        <span>Scale</span>
      </button>
    </div>
  </div>

  <div class="mt-4"></div>

  <div class="loading-spinner" v-if="!pods && isLoading"></div>
  <div v-else-if="pods" class="table-wrapper">
    <PodTable :items="pods" />
  </div>

  <div class="mt-4"></div>
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
