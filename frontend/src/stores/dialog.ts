import { defineStore } from "pinia";
import { ref } from "vue";

type DialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const useDialogStore = defineStore("dialog", () => {
  const isVisible = ref(false);
  const title = ref("");
  const message = ref("");

  function clear() {
    isVisible.value = false;
    title.value = "";
    message.value = "";
    onConfirm.value = clear;
    onCancel.value = clear;
  }

  const onConfirm = ref<() => void>(clear);
  const onCancel = ref<() => void>(clear);

  return {
    showDialog(props: DialogProps) {
      isVisible.value = true;
      title.value = props.title;
      message.value = props.message;
      onConfirm.value = () => {
        props.onConfirm();
        clear();
      };
      onCancel.value = () => {
        props.onCancel?.();
        clear();
      };
    },
    isVisible,
    title,
    message,
    onConfirm,
    onCancel,
  };
});
