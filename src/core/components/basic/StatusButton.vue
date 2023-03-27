<script setup>
defineProps({
  title: String,
  active: Boolean,
});
</script>

<template>
  <button
    :class="[
      active
        ? 'bg-primary-900 border-primary-900 shadow-default shadow-primary-900'
        : 'border-black',
      'transition border  h-11.25 text-white text-left px-3 hover:bg-primary-900 hover:border-primary-900 hover:shadow-default hover:shadow-primary-900',
    ]"
  >
    {{ title }}
  </button>
</template>
