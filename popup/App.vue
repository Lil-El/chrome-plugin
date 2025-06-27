<template>
  <div @click="handleClick">{{ msg }}</div>
</template>

<script setup>
import { ref } from "vue";

const msg = ref("Hello World");

function handleClick() {
  msg.value = "Clicked!";
}
</script>
