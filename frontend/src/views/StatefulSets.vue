<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetStatefulSets } from "../../wailsjs/go/main/App";
import { backend } from "../../wailsjs/go/models";
import { useGlobalStore } from "../stores/global";
import { getTimeAgo } from "../utils/date";
import { getMetadata } from "../utils/k8s";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<backend.StatefulSetListDTO>();
const selectedId = ref<string>();

function getData() {
  if (!activeContextName.value || !activeNamespace.value) return;
  GetStatefulSets(activeContextName.value, activeNamespace.value).then((result) => (items.value = result));
}

let interval: number;
onMounted(() => {
  getData();
  interval = setInterval(getData, 5000);
});

onBeforeUnmount(() => clearInterval(interval));
watch([activeContextName, activeNamespace], getData);
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
            <span class="font-semibold">{{ getMetadata(item)?.name }}</span>
          </div>
        </td>
        <td>
          <span class="text-sm"> {{ item.status?.readyReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm"> {{ item.status?.updatedReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm"> {{ item.status?.currentReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm">
            {{ getTimeAgo(getMetadata(item)?.creationTimestamp) }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
