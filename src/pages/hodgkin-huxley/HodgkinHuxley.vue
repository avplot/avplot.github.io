<template>
  <DefaultPage>
    <Visualize :points="points" />
    <InputRange v-if="false">Here</InputRange>
    <p>This is not the Hodgkin-Huxley model, this is a sine wave!</p>
  </DefaultPage>
</template>

<script setup>
import InputRange from '../../components/InputRange.vue';
import Visualize from '../../components/Visualize.vue';

import { onBeforeMount, ref } from '@vue/runtime-core';

const CHART_POINTS = 500;

let points = ref([]);

/*
<td>C (muF/cm^2):</td>
<input type="number" name="C" min="0.001" max="100" value="1" />

<td>GKMax (mS/cm^2):</td>
<input type="number" name="GKMax" min="0" max="500" value="36" />
<td>GNaMax (mS/cm^2):</td>
<input type="number" name="GNaMax" min="0" max="500" value="120" />
<td>Gm (mS/cm^2):</td>
<input type="number" name="Gm" min="0" max="10" value="0.3" />
<td>EK (mV):</td>
<input type="number" name="EK" min="-200" max="200" value="-12" />
<td>ENa (mV):</td>
<input type="number" name="ENa" min="-200" max="200" value="115" />
<td>VRest (mV):</td>
name="VRest"
value="10.613"
<td>V(0) (mV):</td>
<input type="number" name="V0" min="-200" max="200" value="0" />
<td>tStop (ms):</td>
<input type="number" name="tStop" min="0" max="2000" value="200" />
<td>tInjStart (ms):</td>
name="tInjStart"
value="25"
<td>tInjStop (ms):</td>
name="tInjStop"
value="175"
<td>IDC (nA/cm^2):</td>
<input type="number" name="IDC" min="0" max="200" value="0" />
<td>IRand (nA/cm^2):</td>
<input type="number" name="IRand" min="0" max="200" value="35" />
<td>Itau (ms):</td>
<input type="number" name="Itau" min="0" max="10" value="1" />
*/
onBeforeMount(() => {
  for (let i = 0; i < CHART_POINTS; ++i) {
    const t = (2 * Math.PI * i) / (CHART_POINTS - 1);
    const y = Math.sin(t);
    // const y = Math.sin(t) * Math.exp((Math.PI / 2 - t) / 6);
    points.value.push([t, y]);
  }
});
</script>
