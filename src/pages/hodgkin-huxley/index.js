import * as koch from './params-koch';
import * as neuronalDynamics from './params-neuronal-dynamics';

/*
const params = {
  tStop: 200,
  tInjStart: 25,
  tInjStop: 175,
  IDC: 7,
  IRand: 1,
  ITau: 1,
};
*/

const sources = {
  koch,
  neuronalDynamics,
};

const source = 'koch';
// const source = 'neuronalDynamics';
const overrides = {};

const params = { ...sources[source], ...overrides };

const {
  // Maximum conductance for sodium, potassium and leakage (mS/cm^2)
  g_Na,
  g_K,
  g_L,
  // Reversal potentials for sodium, potassium and leakage (mV).
  E_Na,
  E_K,
  E_L,
  C,
} = params.constants;

function getInjectedCurrent(t) {
  if (t < 5) return 0;
  else if (t <= 10) return 7;
  else return 0;
}

/**
 * Initial values.
 */
export const initial = params.initial;

/**
 * Differential function to integrate.
 *
 * @param {Number} t Current value of the independent variable.
 * @param {Array}  Y Vector of current values.
 * @param {Array} dY Vector to store differential values.
 */
export const fn = (t, Y, dY) => {
  const [V, n, m, h] = Y;

  // Calculate dV/dt.
  dY[0] =
    // Sodium channel current.
    (g_Na * m ** 3 * h * (E_Na - V) +
      // Potassium channel current.
      g_K * n ** 4 * (E_K - V) +
      // Leakage current.
      g_L * (E_L - V) +
      // Injected current.
      getInjectedCurrent(t)) /
    // Divide by capacitance.
    C;

  // Calculate gating coefficients at this potential.
  const { alpha_n, alpha_m, alpha_h, beta_n, beta_m, beta_h } =
    params.gating(V);

  // Use equations (2.9) from
  // https://neuronaldynamics.epfl.ch/online/Ch2.S2.html#Ch2.Ex2
  // rather than the tau_p, p_inf equations (2.6) and in WikiPedia.
  dY[1] = alpha_n * (1 - n) - beta_n * n; // dn/dt;
  dY[2] = alpha_m * (1 - m) - beta_m * m; // dm/dt;
  dY[3] = alpha_h * (1 - h) - beta_h * h; // dh/dt;
};
