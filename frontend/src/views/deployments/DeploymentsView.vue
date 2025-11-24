<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { GetDeployments } from "wailsjs/go/main/App";
import { backend } from "wailsjs/go/models";
import DeploymentGeneral from "@/components/DeploymentGeneral.vue";
import SelectedResource from "@/components/SelectedResource.vue";
import { useGlobalStore } from "@/stores/global";
import { getTimeAgo } from "@/utils/date";
import { getMetadata } from "@/utils/k8s";
import Footer from "@/components/Footer.vue";

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const items = ref<backend.DeploymentListDTO>();
const selectedId = ref<string>();

function getData() {
  if (!activeContextName.value || !activeNamespace.value) return;
  GetDeployments(activeContextName.value, activeNamespace.value).then((result) => {
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
        <th>Ready</th>
        <th>Up-to-date</th>
        <th>Available</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items?.items || []"
        class="cursor-pointer hover:bg-base-200"
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
          <span class="text-sm"> {{ item.status?.readyReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm"> {{ item.status?.updatedReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm"> {{ item.status?.availableReplicas }}/{{ item.status?.replicas }} </span>
        </td>
        <td>
          <span class="text-sm">
            {{ getTimeAgo(getMetadata(item)?.creationTimestamp) }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <SelectedResource
    v-if="selectedId && items"
    resourceType="deployment"
    v-model="selectedId"
    :allResources="(items?.items as any)"
  >
    <template #general="{ selectedResource }">
      <DeploymentGeneral v-if="selectedResource" :selectedResource="(selectedResource as any)" />
    </template>

    <template #footer="{ selectedResource }">
      <Footer :selectedResource="(selectedResource as any)" resource-type="deployments"></Footer>
    </template>
  </SelectedResource>
</template>
