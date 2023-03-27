<script setup>
import NavBar from "@/views/navbar/NavBar.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);
</script>

<template>
  <nav-bar v-if="path !== '/'" />
  <router-view />
</template>
