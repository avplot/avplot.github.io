// src/pages/hodgkin-huxley/params-koch.js

// Parameters from chapter 6 of C. Koch's book Biophysics of Computation,
// modified to offset resting potential to -65mV.

// These appear to be the same as in the Neural Dynamics Python module
// https://github.com/apester/neurodynex3/blob/master/neurodynex3/hodgkin_huxley/HH.py

const uOffset = 65;

export const constants = {
  C: 1,

  E_K: -12 - uOffset,
  E_Na: 115 - uOffset,
  E_L: 10.613 - uOffset,

  g_K: 36,
  g_Na: 120,
  g_L: 0.3,
};

export const initial = {
  V: 0 - uOffset,
  n: 0.32,
  m: 0.05,
  h: 0.6,
};

export const gating = (uBase) => {
  const u = uBase + uOffset;
  const u_n = 10 - u;
  const u_m = 25 - u;
  // const u_h = 30 - u;
  return {
    alpha_n: u_n / (100 * (Math.exp(u_n / 10) - 1)),
    alpha_m: u_m / (10 * (Math.exp(u_m / 10) - 1)),
    alpha_h: 0.07 * Math.exp(u / -20),

    beta_n: 0.125 * Math.exp(u / -80),
    beta_m: 4 * Math.exp(u / -18),
    beta_h: 1 / (Math.exp((30 - u) / 10) + 1),
  };
};

/* These are the original functions; the above should probably be tested against them.
function alphaN(V) {
  if (V === 10) return alphaN(V + 0.001); // 0/0 -> NaN
  return (10 - V) / (100 * (Math.exp((10 - V) / 10) - 1));
}
function betaN(V) {
  return 0.125 * Math.exp(-V / 80);
}
function alphaM(V) {
  if (V === 25) return alphaM(V + 0.001); // 0/0 -> NaN
  return (25 - V) / (10 * (Math.exp((25 - V) / 10) - 1));
}
function betaM(V) {
  return 4 * Math.exp(-V / 18);
}
function alphaH(V) {
  return 0.07 * Math.exp(-V / 20);
}
function betaH(V) {
  return 1 / (Math.exp((30 - V) / 10) + 1);
}
*/
