<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetPods } from "../../../wailsjs/go/main/App";
import { v1 } from "../../../wailsjs/go/models";
import { getTimeAgo } from "../../utils/date";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../../stores/global";
import SelectedResource from "../../components/SelectedResource.vue";
import PodLogs from "./PodLogs.vue";
import { getMetadata } from "../../utils/k8s";
import PodGeneral from "./PodGeneral.vue";
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<v1.PodList>();
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
}

let interval: number;
onMounted(() => {
  getData();
  interval = setInterval(() => {
    getData();
  }, 5000);
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
  <table class="table table-xs">
    <thead>
      <tr>
        <th>Name</th>
        <th>Restarts</th>
        <th>Status</th>
        <th>Age</th>
        <th>CPU</th>
        <th>Memory</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items?.items || []"
        class="cursor-pointer hover:bg-base-300"
        :class="{
          'bg-base-200': selectedId === getMetadata(item)?.uid,
        }"
        @click="selectedId = getMetadata(item)?.uid"
      >
        <td>
          <div class="flex flex-col">
            <span class="font-semibold">{{ getMetadata(item)?.name }}</span>
          </div>
        </td>
        <td>
          <span class="text-sm">
            {{ item.status?.containerStatuses?.[0].restartCount }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{
              item.status?.containerStatuses?.[0].state?.running
                ? "Running"
                : item.status?.containerStatuses?.[0].state?.waiting
                ? "Waiting"
                : item.status?.containerStatuses?.[0].state?.terminated?.exitCode === 0
                ? "Finished"
                : "Error"
            }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{ getTimeAgo(getMetadata(item)?.creationTimestamp) }}
          </span>
        </td>
        <td>
          <span class="text-sm"> - </span>
        </td>
        <td>
          <span class="text-sm"> - </span>
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
        :on-close-pod-view="() => (selectedId = undefined)"
      />
    </template>

    <template #footer="{ selectedResource }">
      <Footer :selectedResource="(selectedResource as any)" resource-type="pods" />
    </template>
  </SelectedResource>
</template>
