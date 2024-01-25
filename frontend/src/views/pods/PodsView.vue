<script lang="ts" setup>
import Footer from "@/components/Footer.vue";
import SelectedResource from "@/components/SelectedResource.vue";
import { useGlobalStore } from "@/stores/global";
import { getTimeAgo } from "@/utils/date";
import { getMetadata, getPodStatus } from "@/utils/k8s";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { GetPods, ListPodMetrics } from "wailsjs/go/main/App";
import { v1, v1beta1 } from "wailsjs/go/models";
import PodGeneral from "./PodGeneral.vue";
import PodLogs from "./PodLogs.vue";
import prettyBytes from "pretty-bytes";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<v1.PodList>();
const metrics = ref<v1beta1.PodMetricsList>();

const selectedId = ref<string>();
const router = useRouter();

watch(selectedId, (value) => {
  if (!value) {
    router.replace({ query: {} });
    return;
  }
  router.replace({ query: { pod: value } });
});

onMounted(() => {
  const query = router.currentRoute.value.query;
  if (query.pod) {
    selectedId.value = query.pod as string;
  }
});

function getData() {
  if (!activeContextName.value || !activeNamespace.value) return;
  GetPods(activeContextName.value, activeNamespace.value).then((result) => {
    items.value = result;
  });
  ListPodMetrics(activeContextName.value, activeNamespace.value).then((result) => {
    metrics.value = result;
  });
}

const dataList = computed(() => {
  if (!items.value || !metrics.value) return;
  const result = items.value.items.map((item) => {
    const podMetrics = metrics.value!.items.find((x) => getMetadata(x)?.name === getMetadata(item)?.name);
    const cpuUsage = podMetrics?.containers.reduce((acc, x) => acc + x.usage?.cpu.replace("n", "") / 1000000 || 0, 0);
    const memoryUsage = podMetrics?.containers.reduce(
      (acc, x) => acc + x.usage?.memory.replace("Ki", "") * 1024 || 0,
      0
    );

    return {
      ...item,
      metrics: podMetrics,
      cpuUsage: cpuUsage ? cpuUsage.toFixed(0) : undefined,
      memoryUsage: memoryUsage ? (memoryUsage / 1024 / 1024).toFixed(0) : undefined,
      friendlyStatus: getPodStatus(item),
    };
  });
  return result;
});

let interval: number;
onMounted(() => {
  getData();
  interval = setInterval(() => {
    getData();
  }, 3000);
});

onBeforeUnmount(() => clearInterval(interval));

watch([activeContextName, activeNamespace], getData);

const selectedPodName = computed(() => {
  if (!selectedId.value) return;
  const result = items.value?.items?.find((x) => getMetadata(x)?.uid === selectedId.value);
  return getMetadata(result)?.name;
});
</script>

<template>
  <table class="table table-xs select-none">
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Status</th>
        <th class="text-left">Restarts</th>
        <th class="text-left">Age</th>
        <th class="text-right">CPU</th>
        <th class="text-right">Memory</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in dataList || []"
        class="cursor-pointer hover:bg-base-300"
        :class="{
          'bg-base-200': selectedId === getMetadata(item)?.uid,
          'text-red-600 opacity-70': item.friendlyStatus === 'Error',
          'text-blue-400': item.friendlyStatus === 'Waiting',
          'text-gray-600': item.friendlyStatus === 'Finished',
        }"
        @click="selectedId = getMetadata(item)?.uid"
      >
        <td class="font-semibold">
          {{ getMetadata(item)?.name }}
        </td>
        <td class="text-sm">
          {{ item.friendlyStatus }}
        </td>
        <td class="text-sm text-left">
          {{ item.status?.containerStatuses?.[0].restartCount }}
        </td>
        <td class="text-sm text-left">
          {{ getTimeAgo(getMetadata(item)?.creationTimestamp) }}
        </td>
        <td class="text-sm text-right">
          {{ item.cpuUsage }}
        </td>
        <td class="text-sm text-right">
          {{ item.memoryUsage }}
        </td>
      </tr>
    </tbody>
  </table>

  <SelectedResource
    v-if="selectedId && items"
    resourceType="pod"
    v-model="selectedId"
    :allResources="(items?.items as any)"
  >
    <template #logs="{ selectedResource }">
      <PodLogs v-if="selectedPodName" :selectedResource="(selectedResource as any)" />
    </template>

    <template #general="{ selectedResource }">
      <PodGeneral
        v-if="selectedPodName"
        :selectedResource="(selectedResource as any)"
        :on-close-pod-view="
          () => {
            selectedId = undefined;
            getData();
          }
        "
      />
    </template>

    <template #footer="{ selectedResource }">
      <Footer :selectedResource="(selectedResource as any)" resource-type="pods" />
    </template>
  </SelectedResource>
</template>
