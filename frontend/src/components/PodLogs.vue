<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { GetPodLogs } from "../../wailsjs/go/main/App";
import { useGlobalStore } from "../stores/global";

const resourceName = defineModel<string | undefined>();
const store = useGlobalStore();

const logs = ref<string[]>();
const container = ref<HTMLElement>();
const interval = ref<number>();

const shouldFollow = ref(true);
const shouldIncludeTimestamps = ref(true);

async function fetchData() {
  if (
    !store.activeContextName ||
    !store.activeNamespace ||
    !resourceName.value
  ) {
    return;
  }

  const result = await GetPodLogs(
    store.activeContextName,
    store.activeNamespace,
    resourceName.value,
    shouldIncludeTimestamps.value
  );

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
    container.value?.scrollTo(0, container.value?.scrollHeight);
  }, 100);

  interval.value = setInterval(() => {
    if (!shouldFollow.value) return;
    fetchData();
    setTimeout(() => {
      container.value?.scrollTo(0, container.value?.scrollHeight);
    }, 10);
  }, 1000);
});

onUnmounted(() => clearInterval(interval.value));
</script>

<template>
  <div class="container h-full overflow-auto py-4" ref="container">
    <template v-for="log in logs">
      <pre v-if="log" :key="log">{{ log }}</pre>
    </template>
  </div>

  <div class="flex mt-2">
    <div class="form-control mr-4">
      <label class="label cursor-pointer">
        <span class="label-text mr-2">Follow logs</span>
        <input
          type="checkbox"
          class="toggle toggle-sm toggle-success"
          v-model="shouldFollow"
        />
      </label>
    </div>

    <div class="form-control mr-4">
      <label class="label cursor-pointer">
        <span class="label-text mr-2">Timestamps</span>
        <input
          type="checkbox"
          class="toggle toggle-sm toggle-success"
          v-model="shouldIncludeTimestamps"
        />
      </label>
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

.container {
  height: calc(100vh - 120px);
}
</style>
