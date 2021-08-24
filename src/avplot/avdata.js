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
    // label: 'Scatter Dataset',
    showLine: true,
    // data: [],
    // pointRadius: [],
    pointBackgroundColor: '#7f007f',
    borderColor: '#9f3f9f',
    borderWidth: 1,
  },
};

class AvData {
  constructor(sourceData, options = {}) {
    this.settings = { ...defaults, ...options };
    this.settings.chartSettings = {
      ...defaults.chartSettings,
      ...this.settings.chartSettings,
      data: [],
      pointRadius: [],
    };

    // Map points to data in the Chart.js format.
    this.minValue = Number.POSITIVE_INFINITY;
    this.maxValue = Number.NEGATIVE_INFINITY;
    this.data = sourceData;

    const { data, pointRadius } = this.settings.chartSettings;

    this.data.data.forEach(([x, y]) => {
      this.minValue = Math.min(this.minValue, y);
      this.maxValue = Math.max(this.maxValue, y);
      data.push({ x, y });
      pointRadius.push(0);
    });
  }

  getChartSettings() {
    return this.settings.chartSettings;
  }
}

export { AvData };
