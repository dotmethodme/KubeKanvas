import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

export type Contexts = {
  name: string;
  namespaces: string[];
  activeNamespace: string;
  active: boolean;
}[];

export const useGlobalStore = defineStore("global", () => {
  const contexts = useLocalStorage<Contexts>("contexts", []);

  const activeContext = computed(() => {
    return contexts.value.find((context) => context.active);
  });

  const activeContextName = computed(() => {
    return activeContext.value?.name;
  });

  const activeNamespace = computed(() => {
    return activeContext.value?.activeNamespace;
  });

  const namespaces = computed(() => {
    return activeContext.value?.namespaces;
  });

  function setActiveContext(contextName: string) {
    contexts.value.forEach((context) => {
      context.active = context.name === contextName;
    });
  }

  function setActiveNamespace(namespaceName: string) {
    contexts.value.forEach((context) => {
      if (context.active) {
        context.activeNamespace = namespaceName;
      }
    });
  }

  return {
    contexts,
    activeContext,
    activeContextName,
    activeNamespace,
    namespaces,
    setActiveContext,
    setActiveNamespace,
  };
});
