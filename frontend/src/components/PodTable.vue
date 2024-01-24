<script lang="ts" setup>
import { v1 } from "../../wailsjs/go/models";
import { getTimeAgo } from "../utils/date";
import { getMetadata } from "../utils/k8s";
import { useRouter } from "vue-router";

const { items } = defineProps<{
  items: v1.Pod[];
}>();


const router = useRouter();

function handleLink(item: v1.Pod) {
  router.push({
    name: "Pods",
    query: {
      pod: getMetadata(item)?.uid,
    },
  });
}
</script>



<template>
  <table class="table table-xs">
    <thead>
      <tr>
        <th>Name</th>
        <th>Restarts</th>
        <th>Status</th>
        <th>Age</th>
        <th>CPU</th>
        <th>Memory</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items || []" class="cursor-pointer hover:bg-base-300" @click="()=>handleLink(item)">
        <td>
          <div class="flex flex-col">
            <span class="font-semibold">{{ getMetadata(item)?.name }}</span>
          </div>
        </td>
        <td>
          <span class="text-sm">
            {{ item.status?.containerStatuses?.[0].restartCount }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{
              item.status?.containerStatuses?.[0].state?.running
                ? "Running"
                : item.status?.containerStatuses?.[0].state?.waiting
                ? "Waiting"
                : item.status?.containerStatuses?.[0].state?.terminated?.exitCode === 0
                ? "Finished"
                : "Error"
            }}
          </span>
        </td>
        <td>
          <span class="text-sm">
            {{ getTimeAgo(getMetadata(item)?.creationTimestamp) }}
          </span>
        </td>
        <td>
          <span class="text-sm"> - </span>
        </td>
        <td>
          <span class="text-sm"> - </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
