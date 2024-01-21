<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetPods } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import { getTimeAgo } from "../utils/date";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../stores/global";
import SelectedResource from "../components/SelectedResource.vue";
import PodLogs from "../components/PodLogs.vue";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<v1.PodList>();
const selectedId = ref<string>();

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
  const result = items.value?.items?.find(
    // @ts-ignore
    (x) => x.metadata.uid === selectedId.value
  );
  // @ts-ignore
  return result?.metadata?.name;
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
        class="cursor-pointer hover:bg-base-200"
        :class="{
          // @ts-ignore
          'bg-base-200': selectedId === item.metadata.uid,
        }"
        @click="
          // @ts-ignore
          selectedId = item.metadata.uid
        "
      >
        <td>
          <div class="flex flex-col">
            <span class="font-semibold">{{
              // @ts-ignore
              item.metadata.name
            }}</span>
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
                : item.status?.containerStatuses?.[0].state?.terminated
                    ?.exitCode === 0
                ? "Finished"
                : "Error"
            }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{
              getTimeAgo(
                // @ts-ignore
                item.metadata.creationTimestamp
              )
            }}
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
    <template #logs>
      <PodLogs v-if="selectedPodName" v-model="selectedPodName" />
    </template>
  </SelectedResource>
</template>
