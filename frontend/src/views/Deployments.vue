<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetDeployments, GetPods } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import { getTimeAgo } from "../utils/date";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../stores/global";

const items = ref<v1.DeploymentList>();

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);

function getData() {
  if (!activeContextName.value || !activeNamespace.value) return;
  GetDeployments(activeContextName.value, activeNamespace.value).then(
    (result) => {
      items.value = result;
    }
  );
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
        <th>Ready</th>
        <th>Up-to-date</th>
        <th>Available</th>
        <th>Age</th>
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
            {{ item.status?.readyReplicas }}/{{ item.status?.replicas }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{ item.status?.updatedReplicas }}/{{ item.status?.replicas }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{ item.status?.availableReplicas }}/{{ item.status?.replicas }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{
              // @ts-ignore
              getTimeAgo(item.metadata.creationTimestamp)
            }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
