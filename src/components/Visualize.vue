<template>
  <div style="height: 40vh">
    <canvas ref="chartRef" />
  </div>

  <div class="py-2">
    <app-button @click="play">Play</app-button>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { createChart } from '../avplot';

const props = defineProps({
  points: {
    type: Array,
    default: () => [],
  },
});

// expects emits options
// const emit = defineEmits(['update', 'delete'])

const chartRef = ref();
let chart = null;

function play() {
  chart.play();
}

onMounted(() => {
  if (chart) {
    chart.destroy();
  }
  chart = createChart({
    el: chartRef.value,
    data: [
      {
        data: props.points,
      },
    ],
  });
});
</script>
