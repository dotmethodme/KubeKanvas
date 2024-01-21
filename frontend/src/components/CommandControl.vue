<script lang="ts" setup>
import { useMagicKeys } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { Command } from "vue-command-palette";
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const { contexts, namespaces } = storeToRefs(globalStore);

function onContextChange(name: string) {
  globalStore.setActiveContext(name);
  visible.value = false;
  topCommand.value = undefined;
}

function onNamespaceChange(name: string) {
  globalStore.setActiveNamespace(name);
  visible.value = false;
  topCommand.value = undefined;
}

const visible = ref(false);
const keys = useMagicKeys();
const slash = keys["slash"];
const at = keys["Digit2"];
const esc = keys["escape"];
const commandSearch = ref("");

watch([slash, at], (v) => {
  if (v) {
    visible.value = true;
  }
});

watch(esc, (v) => {
  if (v) {
    visible.value = false;
    topCommand.value = undefined;
    commandSearch.value = "";
  }
});

const topCommand = ref<"context" | "namespace" | undefined>(undefined);
function selectTopCommand(cmd: "context" | "namespace") {
  topCommand.value = cmd;
  commandSearch.value = "";
}

var shouldShowQuickNs = ref(false);
var shouldShowQuickCtx = ref(false);
watch(commandSearch, (v) => {
  if (v.startsWith("/")) {
    shouldShowQuickNs.value = true;
  } else {
    shouldShowQuickNs.value = false;
  }

  if (v.startsWith("@")) {
    shouldShowQuickCtx.value = true;
  } else {
    shouldShowQuickCtx.value = false;
  }
});
</script>

<template>
  <div class="dark">
    <Command.Dialog :visible="visible" theme="raycast">
      <template #header>
        <Command.Input
          v-model="commandSearch"
          placeholder="Type a command or search..."
          @update:value="(x) => (commandSearch = x)"
        />
      </template>
      <template #body>
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <template v-if="shouldShowQuickNs">
            <Command.Item
              v-for="namespace in namespaces"
              :key="namespace"
              :data-value="'/' + namespace"
              @select="() => onNamespaceChange(namespace)"
            >
              Namespace {{ namespace }}
            </Command.Item>
          </template>

          <template v-if="shouldShowQuickCtx">
            <Command.Item
              v-for="context in contexts"
              :key="context.name"
              :data-value="'@' + context.name"
              @select="() => onContextChange(context.name)"
            >
              Context {{ context.name }}
            </Command.Item>
          </template>

          <template v-if="!topCommand">
            <Command.Item
              data-value="Change namespace ns"
              @select="() => selectTopCommand('namespace')"
            >
              Change namespace
            </Command.Item>
            <Command.Item
              data-value="Change context"
              @select="() => selectTopCommand('context')"
            >
              Change context
            </Command.Item>
          </template>

          <template v-if="topCommand === 'context'">
            <Command.Item
              v-for="context in contexts"
              :key="context.name"
              :data-value="context.name"
              @select="() => onContextChange(context.name)"
            >
              {{ context.name }}
            </Command.Item>
          </template>

          <template v-if="topCommand === 'namespace'">
            <Command.Item
              v-for="namespace in namespaces"
              :key="namespace"
              :data-value="namespace"
              @select="() => onNamespaceChange(namespace)"
            >
              {{ namespace }}
            </Command.Item>
          </template>
        </Command.List>
      </template>
    </Command.Dialog>
  </div>
</template>

<style lang="scss">
@import "../styles/command-pallete.scss";
</style>
