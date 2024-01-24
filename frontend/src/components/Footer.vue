<script lang="ts" setup>
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { v1 } from "wailsjs/go/models";
import { getMetadata } from "@/utils/k8s";
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  selectedResource: v1.Pod | v1.Deployment;
  resourceType: string;
}>();

const metadata = computed(() => getMetadata(props.selectedResource)!);

const { copy, copied } = useClipboard();
</script>

<template>
  <div class="inline-flex items-center border-t px-6 py-4 select-none">
    <span class="text-md tooltip cursor-pointer" data-tip="Namespace">
      {{ metadata.namespace }}
    </span>
    <ChevronRightIcon class="w-3 h-3 mx-2" />
    <span class="text-md tooltip cursor-pointer" data-tip="Resource type"> {{ resourceType }} </span>
    <ChevronRightIcon class="w-3 h-3 mx-2" />
    <span
      class="text-md tooltip cursor-pointer"
      :data-tip="copied ? '🎉 Copied!' : 'Pod name'"
      @click="copy(metadata.name)"
    >
      {{ metadata.name }}</span
    >
  </div>
</template>

<style scoped>
.border-t {
  --tw-border-opacity: 0.2;
  border-color: var(--fallback-bc, oklch(var(--bc) / var(--tw-border-opacity)));
  border-top-width: 1px;
}
</style>
