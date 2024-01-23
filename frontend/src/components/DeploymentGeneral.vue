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

const { error, state: pods, isLoading, execute } = useAsyncState(fetchPods, [], { resetOnExecute: false });

onMounted(async () => {
  interval.value = setInterval(execute, 2000);
});

onUnmounted(() => clearInterval(interval.value));
</script>

<template>
  <div class="mt-4"></div>

  <div class="mt-4"></div>

  <div class="flex justify-between">
    <div>
      <div class="inline-flex items-center">
        <span class="text-lg tooltip cursor-pointer" data-tip="Namespace">
          {{ metadata.namespace }}
        </span>
        <ChevronRightIcon class="w-5 h-5 mx-2" />
        <span class="text-lg tooltip cursor-pointer" data-tip="Resource type"> deployments </span>
        <ChevronRightIcon class="w-5 h-5 mx-2" />
        <span class="text-lg tooltip cursor-pointer" data-tip="Deployment name"> {{ metadata.name }}</span>
      </div>
    </div>

    <div class="mt-10"></div>

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
