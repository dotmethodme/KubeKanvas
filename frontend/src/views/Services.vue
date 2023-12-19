<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetServiceYaml, GetServices } from "../../wailsjs/go/main/App";
import { v1 } from "../../wailsjs/go/models";
import { useGlobalStore } from "../stores/global";
import { getTimeAgo } from "../utils/date";
import YAML from "yaml";

const items = ref<v1.ServiceList>();
const selectedServiceId = ref<string>();

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);

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

onBeforeUnmount(() => {
  clearInterval(interval);
});

watch([activeContextName, activeNamespace], () => {
  getData();
});

const selectedService = computed(() => {
  if (!selectedServiceId.value) return;
  const result = items.value?.items.find(
    (item) => item.metadata.uid === selectedServiceId.value
  );
  return result;
});

const selectedServiceYaml = ref<string>();
watch(selectedService, () => {
  if (
    !selectedService.value?.metadata.name ||
    !activeContextName.value ||
    !activeNamespace.value
  ) {
    return;
  }

  GetServiceYaml(
    activeContextName.value,
    activeNamespace.value,
    selectedService.value.metadata.name
  ).then((result) => {
    selectedServiceYaml.value = result;
  });
});
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
          'bg-base-200': selectedServiceId === item.metadata.uid,
        }"
        @click="
          // @ts-ignore
          selectedServiceId = item.metadata.uid
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
    <div class="drawer drawer-end">
      <input
        id="my-drawer-4"
        type="checkbox"
        class="drawer-toggle"
        :checked="!!selectedServiceId"
      />
      <div class="drawer-side">
        <div
          @click="selectedServiceId = undefined"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></div>
        <div
          class="p-4 w-6/12 min-h-full bg-base-200 text-base-content overflow-auto"
        >
          <pre><code>{{ selectedServiceYaml }}</code></pre>
        </div>
      </div>
    </div>
  </table>
</template>
