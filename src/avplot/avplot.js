// src/avplot/avplot.js

import Plotly from 'plotly.js-basic-dist';
import { AvData } from './avdata';

const defaults = {
  animationDuration: 5000,
  highlightPointRadius: 4,

  maxGain: 0.25,
  valueScale: 1,
  valueOffset: 0,
  // const baseFreq = 440; // A5.
  // const baseFreq = 523.23; // C5.
  baseFrequency: 880, // A6.
  octaveScale: 2,
  octaveOffset: 0,
};

const getPlayer = () => {
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

  return {
    audioCtx,
    amp,
    oscillator,
  };
};

class AvChart {
  constructor(options = {}) {
    this.settings = { ...defaults, ...options };
    this.series = [];
    this.chart = this.createChart(this.settings.el, this.settings);
  }

  async play() {
    const {
      animationDuration,
      data,
      highlightPointRadius,
      maxGain,
      valueScale,
      valueOffset,
      baseFrequency,
      octaveScale,
      octaveOffset,
    } = this.settings;

    const pointsPerMs = data[0].data.length / animationDuration;

    let start, previousTimeStamp;
    let i;

    const { amp, audioCtx, oscillator } = getPlayer();

    await audioCtx.resume();

    const frame = (timestamp) => {
      if (start === undefined) {
        // It's the first frame.
        start = timestamp;
        amp.gain.value = maxGain;
      } else {
        // Clear the previous highlighted point.
        // this.chart.config.data.datasets[0].pointRadius[i] = 0;
      }

      if (i === data[0].data.length - 1) {
        amp.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtx.currentTime + 0.1
        );
        setTimeout(() => {
          audioCtx.suspend();
        }, 200);
        this.chart.update();
        return;
      }

      const elapsed = timestamp - start;

      if (previousTimeStamp !== timestamp) {
        // Math.min() is used here to make sure the element stops at the last point.
        i = Math.min(
          Math.round(pointsPerMs * elapsed),
          this.settings.data[0].data.length - 1
        );
        // this.chart.config.data.datasets[0].pointRadius[i] =
        //   highlightPointRadius;
        const value = this.settings.data[0].data[i][1];
        const scale = 1 / (valueScale * octaveScale);
        const offset = valueOffset - octaveOffset * scale;

        const freq = baseFrequency * 2 ** ((value - offset) * scale);
        oscillator.frequency.linearRampToValueAtTime(
          freq,
          audioCtx.currentTime + 0.01
        );
      }

      previousTimeStamp = timestamp;
      requestAnimationFrame(frame);

      // this.chart.update();
    };

    requestAnimationFrame(frame);
  }

  // const chartRef = ref();
  // let chart = null;

  createChart(el, options) {
    const series = new AvData(options.data[0], options);
    this.series.push(series);

    const offset = 0; // (maxValue - minValue) / 2;
    this.settings.valueOffset = offset;
    this.settings.valueScale = Math.max(
      series.maxValue - offset,
      offset - series.minValue
    );

    const data = [
      series.getChartSettings()
    ];

    const layout = {
      showlegend: false,
      xaxis: {
        title: 'Time (ms)',
      },
      yaxis: {
        title: 'Potential (mV)',
      },
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 0,
        pad: 4
      },
    };

    const config = {
      displaylogo: false,
      responsive: true,
    };

    return Plotly.newPlot(el, data, layout, config);
  }
}

export const createChart = (options) => new AvChart(options);
