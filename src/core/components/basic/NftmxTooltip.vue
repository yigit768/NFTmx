<script setup>
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  custom: Boolean,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const tooltip = ref(false);
const tooltipBox = ref(null);
const tooltipRef = ref(null);
const tooltipStyle = ref({ top: 0, left: 0 });
const computedBoxWidth = computed(() =>
  props.custom
    ? 480
    : props.text.length > 200
    ? 360
    : props.text.length > 50
    ? props.text.length * (-0.01 * props.text.length + 3.8)
    : 175
);
const boxWidth = computed(() =>
  computedBoxWidth.value + 36 > windowWidth.value
    ? windowWidth.value - 36 + "px"
    : computedBoxWidth.value + "px"
);

const showTooltip = () => {
  let tooltipRefPosition = tooltipRef.value.getBoundingClientRect();
  let tooltipBoxPosition = tooltipBox.value.getBoundingClientRect();
  let top = -tooltipRefPosition.height;
  let left = tooltipBoxPosition.width;
  if (tooltipBoxPosition.top < tooltipRefPosition.height) {
    top = tooltipBoxPosition.height;
  }
  if (
    tooltipBoxPosition.left + tooltipRefPosition.width + 18 >
    windowWidth.value
  ) {
    left = -tooltipRefPosition.width;
  }
  tooltipStyle.value = {
    top: top + "px",
    left: tooltipBoxPosition.left - Math.abs(left) - 18 > 0 ? left + "px" : "",
  };
};
</script>

<template>
  <sup
    ref="tooltipBox"
    @mouseover="tooltip = true"
    @mouseout="tooltip = false"
    @mouseenter="showTooltip()"
    class="h-fit"
  >
    <slot />
    <div
      ref="tooltipRef"
      :class="[
        tooltip ? 'opacity-100 z-50' : 'hidden -z-50',
        'absolute transition bg-black text-white font-ibm-light text-left text-11 shadow-default shadow-primary-900 px-4 py-3',
      ]"
      :style="{
        ...tooltipStyle,
        width: boxWidth,
      }"
    >
      {{ text }}
      <slot name="custom" />
    </div>
  </sup>
</template>
