<template>
  <div class="w-50 h-70 p-1 flex flex-col items-center relative overflow-hidden">
    <h1 class="text-xl mb-2">{{ title }}</h1>

    <div
      class="w-20 aspect-square rounded-3xl flex justify-center items-center cursor-pointer shadow shadow-gray-300 hover:shadow-gray-700"
      :style="{ backgroundColor: color }"
      title="copy"
      @click="handleCopy"
    >
      <span class="text-3xl invert">+</span>
    </div>
    <span class="mt-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer" @click.stop="handleAbsorb"
      >点击吸色</span
    >

    <div
      v-if="showTip"
      class="p-1 px-2 rounded-md text-xs justify-self-end bg-green-100 text-green-500 absolute bottom-2 animate-translate"
    >
      Copy Color Success
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const title = ref("Color Picker");

const color = ref("#000000");

const showTip = ref(false);

onMounted(() => {
  chrome.storage.local.get("pickedColor", (result) => {
    if (result.pickedColor) {
      color.value = result.pickedColor;
    }
  });
});

function handleAbsorb() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.sendMessage({ type: "absorbColor", tabId: tabs[0].id });
  });
}

const handleCopy = () => {
  navigator.clipboard.writeText(color.value);
  showTip.value = true;
  setTimeout(() => {
    showTip.value = false;
  }, 2000);
};
</script>
