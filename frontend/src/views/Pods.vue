<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetPods } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import { getTimeAgo } from "../utils/date";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../stores/global";

const items = ref<v1.PodList>();

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);

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

onBeforeUnmount(() => {
  clearInterval(interval);
});

watch([activeContextName, activeNamespace], () => {
  getData();
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
      <tr v-for="item in items?.items || []">
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
</template>
