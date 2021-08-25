// src/avplot/avplot.js

// @TODO animations should be done for each plot, controlled by the chart.
// @TODO many more things need to be configurable - AXIS TITLES!!!

import Plotly from 'plotly.js-basic-dist';
import { AvData } from './avdata';

const defaults = {
  animationDuration: 5000,
  highlightPointRadius: 6,

  maxGain: 0.25,
  valueScale: 1,
  valueOffset: 0,
  // const baseFreq = 440; // A5.
  // const baseFreq = 523.23; // C5.
  baseFrequency: 880, // A6.
  octaveScale: 2,
  octaveOffset: 0,
};

// const colorway = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
//                   '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

// Default chart layout options.
const defaultLayout = {
  showlegend: false,
  margin: {
    l: 50,
    r: 10,
    b: 50,
    t: 0,
    pad: 4,
  },
  annotations: [
    {
      xref: 'paper',
      yref: 'paper',
      x: 1,
      xanchor: 'right',
      y: -0.1,
      yanchor: 'top',
      text: '© avplot.com',
      font: { size: 11, color: '#CBD5E1' },
      showarrow: false,
    },
  ],
  // colorway,
};

// Default chart config options.
const defaultConfig = {
  displaylogo: false,
  responsive: true,
  // Edit chart link.
  // showLink: true,
  // plotlyServerURL: "https://chart-studio.plotly.com",
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
    this.createChart(this.settings.el, this.settings);
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

    const animateOptions = {
      transition: { duration: 0 },
      frame: { duration: 0, redraw: false },
    };

    let start, previousTimeStamp;
    let i;

    const frame = (timestamp) => {
      if (start === undefined) {
        // It's the first frame.
        start = timestamp;
        amp.gain.value = maxGain;
      }

      if (i === data[0].data.length - 1) {
        // Delete the moving marker dataset.
        Plotly.deleteTraces(this.chart, traceId);

        amp.gain.exponentialRampToValueAtTime(
          0.000001,
          audioCtx.currentTime + 0.1
        );
        setTimeout(() => {
          audioCtx.suspend();
        }, 2000);
        return;
      }

      const elapsed = timestamp - start;

      if (previousTimeStamp !== timestamp) {
        // Calculate which point we have reached in the animation.
        i = Math.min(
          Math.round(pointsPerMs * elapsed),
          this.settings.data[0].data.length - 1
        );

        const [x, y] = this.settings.data[0].data[i];

        // Update the moving point on the chart.
        Plotly.animate(
          this.chart,
          {
            data: [{ x: [x], y: [y] }],
            traces: [traceId],
          },
          animateOptions
        );

        const scale = 1 / (valueScale * octaveScale);
        const offset = valueOffset - octaveOffset * scale;

        const freq = baseFrequency * 2 ** ((y - offset) * scale);
        oscillator.frequency.linearRampToValueAtTime(
          freq,
          audioCtx.currentTime + 0.01
        );
      }

      previousTimeStamp = timestamp;
      requestAnimationFrame(frame);
    };

    const { amp, audioCtx, oscillator } = getPlayer();

    const traceId = this.chart.data.length;

    await audioCtx.resume();

    const [x, y] = this.settings.data[0].data[0];

    // Add the moving point to the Plotly chart as a new trace.
    await Plotly.addTraces(this.chart, {
      mode: 'points',
      type: 'scatter',
      marker: { size: highlightPointRadius * 2 },
    });

    // Update the moving point on the chart.
    Plotly.animate(
      this.chart,
      {
        data: [{ x: [x], y: [y] }],
        traces: [traceId],
      },
      animateOptions
    );

    requestAnimationFrame(frame);
  }

  // const chartRef = ref();
  // let chart = null;

  async createChart(el, options) {
    const series = new AvData(options.data[0], options);
    this.series.push(series);

    const offset = 0; // (maxValue - minValue) / 2;
    this.settings.valueOffset = offset;
    this.settings.valueScale = Math.max(
      series.maxValue - offset,
      offset - series.minValue
    );

    const data = [series.getChartSettings()];

    const layout = {
      ...defaultLayout,
      xaxis: {
        title: 'Time (ms)',
      },
      yaxis: {
        title: 'Potential (mV)',
      },
    };

    const config = {
      ...defaultConfig,
    };

    this.chart = await Plotly.newPlot(el, data, layout, config);
  }
}

export const createChart = (options) => new AvChart(options);
