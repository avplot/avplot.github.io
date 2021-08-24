<template>
  <DefaultPage>
    <Visualize :points="points" />
    <InputRange v-if="false">Here</InputRange>
    <div class="prose">
      <p>
        This is a visualization of a model of a neuron first described in
        1952<sup>[1]</sup>
        by A.L. Hodgkin and A. F. Huxley (the Hodgkin-Huxley model). The curve
        shows the response of the neuron in mV over a 30ms period to an input
        current of 7mA from t = 5ms to t = 10ms.
      </p>
      <p>
        The system of differential equations is taken from the book Neuronal
        Dynamics<sup>[2]</sup>, although the parameters used in that book have
        been replaced by parameters from work by Koch<sup>[3]</sup>, modified to
        reflect a rest potential of -55mV.
      </p>
      <ul>
        <li>
          [1]
          <a
            href="https://doi.org/10.1113/jphysiol.1952.sp004764"
            target="_blank"
            >https://doi.org/10.1113/jphysiol.1952.sp004764</a
          >
        </li>
        <li>
          [2]
          <a
            href="https://neuronaldynamics.epfl.ch/online/Ch2.S2.html"
            target="_blank"
            >Wulfram Gerstner, Werner M. Kistler, Richard Naud and Liam Paninski
            <em>Neuronal Dynamics</em></a
          >
        </li>
        <li>
          [3]
          <a
            href="https://oxford.universitypressscholarship.com/view/10.1093/oso/9780195104912.001.0001/isbn-9780195104912"
            target="_blank"
            >Christof Koch (1998) <em>Biophysics of Computation</em></a
          >
        </li>
      </ul>
    </div>
  </DefaultPage>
</template>

<script setup>
import InputRange from '../../components/InputRange.vue';
import Visualize from '../../components/Visualize.vue';

import { onBeforeMount, ref } from '@vue/runtime-core';

import { createInitialValueProblem } from 'solve-ode/dist/esm';

import { initial, fn } from './index';

let points = ref([]);

onBeforeMount(() => {
  // Set up the DE function and initial values.
  // const fn = (t, Y, dY) => (dY[0] = Y[0]);
  const range = [0, 30];
  const y0 = Object.values(initial);

  // Set fixed step and save values for each step.
  const options = { step: 0.0125, stepCallback: true };

  // Run the solver.
  const ivp = createInitialValueProblem(fn, range, y0, options).solve();

  // Rearrange the step values for chart.js and draw a chart.
  points.value = ivp.steps.map(([x, [y]]) => [x, y]);
  // ivp.steps.map(([x, [y]]) => { points.push([x, y])});
});
</script>
