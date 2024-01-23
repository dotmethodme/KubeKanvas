<template>
  <dialog class="modal text-left" :class="{ 'modal-open': isVisible }">
    <div class="modal-box">
      <h3 class="font-semibold text-xl">{{ title }}</h3>
      <p class="py-4 text-lg">{{ message }}</p>
      <div class="modal-action">
        <button class="btn" @click="onCancel">Close</button>
        <button class="btn btn-error btn-outline" @click="onConfirm">Confirm</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="onCancel"></form>
  </dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDialogStore } from "../stores/dialog";

const store = useDialogStore();
const { isVisible, message, title, onCancel, onConfirm } = storeToRefs(store);
</script>

<style scoped>
/* Your styles here */
</style>
