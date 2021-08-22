<template>
  <!--Nav-->
  <nav class="bg-blueGray-300 py-0 mt-0 fixed w-full z-10 top-0">
    <div class="container mx-auto px-2 flex flex-wrap items-center">
      <div
        class="
          flex
          w-full
          md:w-1/2
          justify-center
          md:justify-start
          text-white
          font-extrabold
        "
      >
        <a
          class="text-white no-underline hover:text-white hover:no-underline"
          href="#"
        >
          <span class="text-2xl text-gray-600">avPlot</span>
        </a>
      </div>
      <div
        class="
          flex
          w-full
          content-center
          justify-between
          md:w-1/2 md:justify-end
        "
      >
        <ul
          class="
            list-reset
            flex
            justify-between
            flex-1
            md:flex-none
            items-center
          "
        >
          <li v-for="item in menu" :key="item.path" class="mr-3">
            <span
              v-if="item.to === route.path"
              class="inline-block py-2 px-4 text-white no-underline"
              :to="item.to"
              >{{ item.label }}</span
            >
            <router-link
              v-else
              class="
                inline-block
                text-gray-700
                no-underline
                hover:underline
                py-2
                px-4
              "
              :to="item.to"
              >{{ item.label }}</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!--Container-->
  <div class="container mx-auto mt-24 md:mt-16 h-screen px-2">
    <slot></slot>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const menu = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

const route = useRoute();
</script>
