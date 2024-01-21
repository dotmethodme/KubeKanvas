<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetServices } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import SelectedResource from "../components/SelectedResource.vue";
import { useGlobalStore } from "../stores/global";
import { getTimeAgo } from "../utils/date";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<v1.ServiceList>();
const selectedId = ref<string>();

function getData() {
  if (!activeContextName.value || !activeNamespace.value) return;
  GetServices(activeContextName.value, activeNamespace.value).then((result) => {
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
</script>

<template>
  <table class="table table-xs">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Cluster IP</th>
        <th>Ports</th>
        <th>Age</th>
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
          <span class="font-semibold">{{
            // @ts-ignore
            item.metadata.name
          }}</span>
        </td>
        <td>
          <span class="text-sm">{{ item.spec?.type }}</span>
        </td>
        <td>
          <span class="text-sm">{{ item?.spec?.clusterIP }}</span>
        </td>

        <td>
          <span class="text-sm">{{
            item.spec?.ports?.map((port) => port.port).join(", ")
          }}</span>
        </td>
        <td>
          <span class="text-sm">{{
            // @ts-ignore
            getTimeAgo(item.metadata.creationTimestamp)
          }}</span>
        </td>
      </tr>
    </tbody>
  </table>

  <SelectedResource
    v-if="selectedId && items"
    resourceType="service"
    v-model="selectedId"
    :allResources="(items?.items as any)"
  />
</template>
