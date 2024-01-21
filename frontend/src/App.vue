<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { GetAvailableContexts, GetNamespaces } from "../wailsjs/go/main/App";
import CommandControl from "./components/CommandControl.vue";
import { Contexts, useGlobalStore } from "./stores/global";
import { menu } from "./utils/menu";

const globalStore = useGlobalStore();
const route = useRoute();
const { contexts, activeContextName, namespaces, activeNamespace } =
  storeToRefs(globalStore);

async function getContexts() {
  const result = await GetAvailableContexts();
  const newValues: Contexts = result.map((item) => {
    const existing = contexts.value.find((context) => context.name === item);
    return {
      name: item,
      namespaces: existing?.namespaces || [],
      activeNamespace: existing?.activeNamespace || "",
      active: existing?.active || false,
    };
  });

  if (!activeContextName.value) {
    newValues[0].active = true;
  }
  console.log("Getting contexts", newValues);

  contexts.value = newValues;
}

async function getNamespaces() {
  if (!activeContextName.value) return;
  const result = await GetNamespaces(activeContextName.value);
  // @ts-ignore
  const newItems = result.items.map((item) => item.metadata.name);
  console.log("Getting namespaces", activeContextName, newItems);
  const newValue = contexts.value.map((context) => {
    if (context.name === activeContextName.value) {
      if (!context.activeNamespace) {
        context.activeNamespace = newItems[0];
      }
      return {
        ...context,
        namespaces: newItems,
      };
    }
    return context;
  });

  contexts.value = newValue;
}

onMounted(async () => {
  await getContexts();
  await getNamespaces();
});

watch(activeContextName, async () => {
  await getNamespaces();
});

function onContextChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  if (!target.value) return;
  globalStore.setActiveContext(target.value);
}

function onNamespaceChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  if (!target.value) return;
  globalStore.setActiveNamespace(target.value);
}

const selectContext = ref<HTMLSelectElement>();
</script>

<template>
  <div class="flex flex-row h-full">
    <div class="bg-base-200 w-56">
      <div class="p-4 pb-0">
        <select
          ref="selectContext"
          class="select select-sm select-bordered w-full max-w-xs"
          @change="onContextChange"
          :value="activeContextName"
        >
          <option disabled selected>Context</option>
          <option v-for="context in contexts" :value="context.name">
            {{ context.name }}
          </option>
        </select>

        <div class="pb-1"></div>
        <select
          class="select select-sm select-bordered w-full max-w-xs mt-2"
          @change="onNamespaceChange"
          :value="activeNamespace"
        >
          <option disabled selected>Namespace</option>
          <option v-for="namespace in namespaces" :value="namespace">
            {{ namespace }}
          </option>
        </select>
      </div>

      <ul class="menu menu-sm">
        <template v-for="item of menu">
          <div
            class="menu-title text-base-content flex flex-row items-center font-semibold mt-4"
          >
            <Icon :icon="item.icon" />
            <span class="pl-2">{{ item.title }}</span>
          </div>
          <li v-for="subitem of item.items">
            <router-link
              :to="subitem.route"
              :class="{ active: subitem.route === route.path }"
            >
              {{ subitem.title }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <router-view></router-view>
    </div>

    <CommandControl />
  </div>
</template>

<style lang="scss">
@import "./styles/command-pallete.scss";

#logo {
  display: block;
  width: 50%;
  height: 50%;
  margin: auto;
  padding: 10% 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-origin: content-box;
}
</style>
