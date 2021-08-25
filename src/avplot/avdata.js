// src/avplot/avdata.js

const defaults = {
  maxGain: 0.25,
  valueScale: 1,
  valueOffset: 0,
  // const baseFreq = 440; // A5.
  // const baseFreq = 523.23; // C5.
  baseFrequency: 880, // A6.
  octaveScale: 2,
  octaveOffset: 0,

  chartSettings: {
    // x: [1, 2, 3, 4],
    // y: [12, 9, 15, 12],
    mode: 'lines',
    type: 'scatter',
    // showlegend: false,
  },
};

class AvData {
  constructor(sourceData, options = {}) {
    this.settings = { ...defaults, ...options };
    this.settings.chartSettings = {
      ...defaults.chartSettings,
      ...this.settings.chartSettings,
      x: [],
      y: [],
      // pointRadius: [],
    };

    // Map points to data in the Chart.js format.
    this.minValue = Number.POSITIVE_INFINITY;
    this.maxValue = Number.NEGATIVE_INFINITY;
    this.data = sourceData;

    const { x, y } = this.settings.chartSettings;

    this.data.data.forEach(([xx, yy]) => {
      this.minValue = Math.min(this.minValue, xx);
      this.maxValue = Math.max(this.maxValue, yy);
      x.push(xx);
      y.push(yy);
      // pointRadius.push(0);
    });
  }

  getChartSettings() {
    return this.settings.chartSettings;
  }
}

export { AvData };
