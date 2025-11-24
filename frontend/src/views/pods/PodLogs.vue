<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { GetPodLogs } from "../../../wailsjs/go/main/App";
import { useGlobalStore } from "../../stores/global";
import { backend } from "../../../wailsjs/go/models";
import { getMetadata } from "../../utils/k8s";

const props = defineProps<{
  selectedResource: backend.PodDTO;
}>();

const resourceName = computed(() => getMetadata(props.selectedResource)?.name);

const containerNames = computed(() => {
  if (!props.selectedResource?.spec?.containers) return [];
  return props.selectedResource.spec.containers.map((x) => x.name);
});

const selectedContainer = ref<string>();

watch(
  containerNames,
  () => {
    if (containerNames.value.length >= 1) {
      selectedContainer.value = containerNames.value[0];
    }
  },
  { immediate: true }
);

const store = useGlobalStore();

const logs = ref<string[]>();
const container = ref<HTMLElement>();
const interval = ref<number>();

const shouldFollow = ref(true);
const shouldIncludeTimestamps = ref(true);
const shouldWrapLines = ref(false);

async function fetchData() {
  if (!store.activeContextName || !store.activeNamespace || !resourceName.value) {
    return;
  }

  const result = await GetPodLogs({
    contextName: store.activeContextName,
    namespace: store.activeNamespace,
    podName: resourceName.value,
    container: containerNames.value[0],
    shouldIncludeTimestamps: shouldIncludeTimestamps.value,
  });

  if (typeof result === "string") {
    // todo: handle error
    console.error(result);
    return;
  }

  logs.value = result;
}

onMounted(async () => {
  await fetchData();

  setTimeout(() => {
    const left = container.value?.scrollLeft;
    container.value?.scrollTo({
      top: container.value?.scrollHeight,
      left: left,
    });
  }, 100);

  interval.value = setInterval(() => {
    if (!shouldFollow.value) return;
    fetchData();
    setTimeout(() => {
      const left = container.value?.scrollLeft;
      container.value?.scrollTo({
        top: container.value?.scrollHeight,
        left: left,
        behavior: "smooth",
      });
    }, 10);
  }, 1000);
});

onUnmounted(() => clearInterval(interval.value));
</script>

<template>
  <div class="flex-1">
    <div v-if="containerNames.length > 1">
      <div class="form-control flex flex-row gap-2">
        <label class="label">
          <span class="label-text">Container</span>
        </label>
        <select class="select select-bordered select-sm" v-model="selectedContainer">
          <option v-for="container in containerNames" :key="container" :value="container">{{ container }}</option>
        </select>
      </div>
    </div>

    <div class="container flex-1 overflow-auto py-4" ref="container">
      <template v-for="log in logs">
        <pre v-if="log" :key="log" :class="{ wraplines: shouldWrapLines }">{{ log }}</pre>
      </template>
    </div>

    <div class="flex mt-2">
      <div class="form-control mr-4">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Follow logs</span>
          <input type="checkbox" class="toggle toggle-sm toggle-success" v-model="shouldFollow" />
        </label>
      </div>

      <div class="form-control mr-4">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Timestamps</span>
          <input type="checkbox" class="toggle toggle-sm toggle-success" v-model="shouldIncludeTimestamps" />
        </label>
      </div>

      <div class="form-control mr-4">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Wrap lines</span>
          <input type="checkbox" class="toggle toggle-sm toggle-success" v-model="shouldWrapLines" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  padding: 0;
  margin: 0;
  line-height: 1.4;
  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  font-weight: 400;
}

pre.wraplines {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 4px;
}

.container {
  height: calc(100vh - 160px);
}
</style>
