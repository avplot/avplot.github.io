<template>
  <div style="xposition: relative; height: 40vh">
    <canvas ref="chartRef" />
  </div>

  <app-button @click="animate">Play</app-button>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';

import {
  Chart,
  ArcElement,
  LineElement,
  // BarElement,
  PointElement,
  // BarController,
  // BubbleController,
  // DoughnutController,
  // LineController,
  // PieController,
  // PolarAreaController,
  // RadarController,
  ScatterController,
  // CategoryScale,
  LinearScale,
  // LogarithmicScale,
  // RadialLinearScale,
  // TimeScale,
  // TimeSeriesScale,
  // Decimation,
  // Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  PointElement,
  ScatterController,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

const props = defineProps({
  points: {
    type: Array,
    default: () => [],
  },
});

// expects emits options
// const emit = defineEmits(['update', 'delete'])

const config = {
  highlightPointRadius: 4,
  animationDuration: 1000,
  maxGain: 0.25,
  valueScale: 1,
  valueOffset: 0,
  // const baseFreq = 440; // A5.
  // const baseFreq = 523.23; // C5.
  baseFrequency: 880, // A6.
  octaveScale: 2,
  octaveOffset: 0,
};

// create web audio api context
const audioCtx = new AudioContext();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
const amp = audioCtx.createGain();
amp.gain.value = 0;

// oscillator.type = 'square';
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
oscillator.connect(amp).connect(audioCtx.destination);
oscillator.start();
audioCtx.suspend();

async function animate() {
  const pointsPerMs = props.points.length / config.animationDuration;

  let start, previousTimeStamp;
  let i;
  await audioCtx.resume();

  function frame(timestamp) {
    if (start === undefined) {
      // It's the first frame.
      start = timestamp;
      amp.gain.value = config.maxGain;
    } else {
      // Clear the previous highlighted point.
      chart.config.data.datasets[0].pointRadius[i] = 0;
    }

    if (i === props.points.length - 1) {
      amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      setTimeout(() => {
        audioCtx.suspend();
      }, 200);
      chart.update();
      return;
    }

    const elapsed = timestamp - start;

    if (previousTimeStamp !== timestamp) {
      // Math.min() is used here to make sure the element stops at the last point.
      i = Math.min(Math.round(pointsPerMs * elapsed), props.points.length - 1);
      chart.config.data.datasets[0].pointRadius[i] =
        config.highlightPointRadius;
      const value = props.points[i][1];
      const scale = config.valueScale * config.octaveScale;
      const offset = config.valueOffset - config.octaveOffset / scale;

      const freq = config.baseFrequency * 2 ** ((value - offset) * scale);
      oscillator.frequency.linearRampToValueAtTime(
        freq,
        audioCtx.currentTime + 0.01
      );
    }

    previousTimeStamp = timestamp;
    requestAnimationFrame(frame);

    chart.update();
  }

  requestAnimationFrame(frame);
}

const chartRef = ref();
let chart = null;

function createChart() {
  if (chart) {
    chart.destroy();
  }

  // Map points to data in the Chart.js format.
  const data = props.points.map(([x, y]) => ({ x, y }));
  const pointRadius = data.map(() => 0);

  chart = new Chart(chartRef.value, {
    type: 'scatter',
    data: {
      datasets: [
        {
          // label: 'Scatter Dataset',
          showLine: true,
          data,
          pointRadius,
          pointBackgroundColor: '#7f007f',
          borderColor: '#9f3f9f',
          borderWidth: 1,
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      // Required for responsive sizing to work.
      maintainAspectRatio: false,
    },
  });
}

onMounted(() => {
  createChart();
});
</script>
