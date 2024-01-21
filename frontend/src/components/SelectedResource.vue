<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { GetResourceYaml } from "../../wailsjs/go/main/App";
import { useGlobalStore } from "../stores/global";

const resourceId = defineModel<string | undefined>();
const props = defineProps<{
  resourceType: string;
  allResources: {
    metadata: {
      uid: string;
      name: string;
    };
  }[];
}>();

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const selectedServiceYaml = ref<string>();
const loading = ref(false);

const selectedService = computed(() => {
  if (!resourceId) return;
  const result = props.allResources?.find(
    (x) => x.metadata.uid === resourceId.value
  );
  return result;
});

watch(
  selectedService,
  async () => {
    console.log("selectedService changed", selectedService.value);
    if (
      !selectedService.value?.metadata.name ||
      !activeContextName.value ||
      !activeNamespace.value
    ) {
      return;
    }

    loading.value = true;
    const result = await GetResourceYaml({
      contextName: activeContextName.value,
      namespace: activeNamespace.value,
      resourceType: props.resourceType,
      resourceName: selectedService.value?.metadata.name,
    });
    selectedServiceYaml.value = result;
    loading.value = false;
  },
  { immediate: true }
);
</script>

<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer-4"
      type="checkbox"
      class="drawer-toggle"
      :checked="!!resourceId"
    />
    <div class="drawer-side">
      <div
        @click="resourceId = undefined"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></div>
      <div
        class="p-4 w-6/12 min-h-full bg-base-200 text-base-content overflow-auto"
      >
        <span
          v-if="!selectedServiceYaml && loading"
          class="loading loading-spinner loading-sm"
        ></span>
        <pre v-else><code>{{ selectedServiceYaml }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer {
  text-align: left;
}
</style>
