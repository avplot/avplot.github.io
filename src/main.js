// src/main.js
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
// import store from './store';

import './index.css';

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

import DefaultPage from './components/DefaultPage.vue';
import AppButton from './components/AppButton.vue';

createApp(App)
  // .use(store)
  .use(router)
  .component('VueSlider', VueSlider)
  .component('DefaultPage', DefaultPage)
  .component('AppButton', AppButton)
  .mount('#app');
