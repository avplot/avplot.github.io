// src/pages/hodgkin-huxley/params-neuronal-dynamics.js

// Parameters from https://neuronaldynamics.epfl.ch/online/Ch2.S2.html

export const constants = {
  // CHECK
  C: 1,

  E_Na: 55,
  E_K: -77,
  E_L: -65,

  g_Na: 40,
  g_K: 35,
  g_L: 0.3,
};

export const initial = {
  // CHECK
  V: -65,
  n: 0.32, // 0.32,
  m: 0.05, // 0.05,
  h: 0.6, // 0.6,
};

export const gating = (u) => {
  const u_n = u - 25;
  const u_m = u + 35;
  const u_h = u + 90;
  return {
    alpha_n: (0.02 * u_n) / (1 - Math.exp(u_n / -9)),
    alpha_m: (0.182 * u_m) / (1 - Math.exp(u_m / -9)),
    alpha_h: 0.25 * Math.exp(u_h / -12),

    beta_n: (-0.002 * u_n) / (1 - Math.exp(u_n / 9)),
    beta_m: (-0.124 * u_m) / (1 - Math.exp(u_m / 9)),
    beta_h: (0.25 * Math.exp((u + 62) / 6)) / Math.exp(u_h / 12),
  };
};
