<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { GetResourceYaml } from "../../wailsjs/go/main/App";
import { useGlobalStore } from "../stores/global";
import { GenericResourceWithMetadata } from "../utils/k8s";
import { useStorage } from "@vueuse/core";
import hljs from "highlight.js/lib/core";
import yaml from "highlight.js/lib/languages/yaml";
import "highlight.js/styles/an-old-hope.css";

hljs.registerLanguage("yaml", yaml);

const resourceId = defineModel<string | undefined>();
const props = defineProps<{
  resourceType: string;
  allResources: GenericResourceWithMetadata[];
}>();

const globalStore = useGlobalStore();
const { activeContextName, activeNamespace } = storeToRefs(globalStore);
const selectedServiceYaml = ref<string>();
const loading = ref(false);

const selectedResource = computed(() => {
  if (!resourceId) return;
  const result = props.allResources?.find((x) => x.metadata.uid === resourceId.value);
  return result;
});

watch(
  selectedResource,
  async () => {
    if (!selectedResource.value?.metadata.name || !activeContextName.value || !activeNamespace.value) {
      return;
    }

    loading.value = true;
    const result = await GetResourceYaml({
      contextName: activeContextName.value,
      namespace: activeNamespace.value,
      resourceType: props.resourceType,
      resourceName: selectedResource.value?.metadata.name,
    });
    selectedServiceYaml.value = result;
    loading.value = false;
    setTimeout(() => {
      hljs.highlightAll();
    }, 0);
  },
  { immediate: true }
);

const activeTab = useStorage(`${props.resourceType}:tab`, 0);

watch(activeTab, (value) => {
  if (value === 2) {
    setTimeout(() => {
      hljs.highlightAll();
    }, 0);
  }
});
</script>

<template>
  <div class="drawer drawer-end">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" :checked="!!resourceId" />
    <div class="drawer-side">
      <div @click="resourceId = undefined" aria-label="close sidebar" class="drawer-overlay"></div>
      <div class="p-4 w-8/12 min-h-full bg-base-200 text-base-content overflow-auto">
        <div role="tablist" class="tabs tabs-bordered tabs-md mb-2">
          <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 0 }" @click="activeTab = 0"> General </a>
          <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 1 }" @click="activeTab = 1"> Logs </a>
          <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 2 }" @click="activeTab = 2"> Yaml </a>
        </div>
        <template v-if="activeTab === 0">
          <slot name="general" :selectedResource="selectedResource"> </slot>
        </template>
        <template v-if="activeTab == 1">
          <slot name="logs" :selectedResource="selectedResource"> </slot>
        </template>
        <template v-if="activeTab === 2">
          <span v-if="!selectedServiceYaml && loading" class="loading loading-spinner loading-sm"></span>
          <pre v-else><code class="language-yaml">{{ selectedServiceYaml }}</code></pre>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer {
  text-align: left;
}
</style>
