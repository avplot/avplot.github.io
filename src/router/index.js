import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import HodgkinHuxley from '../pages/hodgkin-huxley/HodgkinHuxley.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/hodgkin-huxley', component: HodgkinHuxley },
  { path: '/about', component: About },
  /*
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" * / '../views/About.vue')
  }
  */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
