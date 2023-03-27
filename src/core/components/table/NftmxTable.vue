<script setup>
defineProps({
  limitHeight: { type: Boolean, default: true },
});
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="min-w-full">
        <div :class="[limitHeight ? 'max-h-[80vh]' : '', 'overflow-y-auto']">
          <table class="w-full divide-y divide-black font-ibm text-white">
            <slot />
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
