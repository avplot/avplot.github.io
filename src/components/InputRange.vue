<template>
  <div>
    <input v-model="val" />
    <slot></slot>
    <input v-model="val" />
  </div>
  <div>
    <VueSlider v-model="val" tooltip="none" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
/*
const props = defineProps({
  default: {
    type: Number,
    default: 10,
  },
});
*/
// expects emits options
// const emit = defineEmits(['update', 'delete'])
const val = ref(10);
</script>

<style></style>
