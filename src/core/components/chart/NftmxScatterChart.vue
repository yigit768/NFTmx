<script setup>
import { computed, ref, watch, watchEffect } from "vue";
const defaultChartOption = {
  chart: {
    id: "sale-history-chart",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: "#949494",
  },
  stroke: {
    curve: "stepline",
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  colors: ["#19cb58", "#19cb58"],
  markers: {
    size: [5, 0],
    colors: "#151515",
    strokeColors: ["#949494", "#19cb58"],
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  grid: {
    borderColor: "#000000",
  },
  yaxis: {
    show: true,
    axisBorder: {
      show: true,
      color: "#000000",
    },
    axisTicks: {
      show: true,
      color: "#000000",
    },
    tickAmount: 7,
  },
};

const props = defineProps({
  data: Array,
});

const chartOptions = ref(defaultChartOption);
const series = ref([
  {
    name: "Points",
    type: "scatter",

    //2.14, 2.15, 3.61, 4.93, 2.4, 2.7, 4.2, 5.4, 6.1, 8.3
    data: [
      {
        x: 0.5,
        y: 2.14,
      },
      {
        x: 1.2,
        y: 2.1,
      },
      {
        x: 1.8,
        y: 1.8,
      },
      {
        x: 1.9,
        y: 1.9,
      },
      {
        x: 1.9,
        y: 2.5,
      },
      {
        x: 2.3,
        y: 3.8,
      },
      {
        x: 3.2,
        y: 0.8,
      },
      {
        x: 3.8,
        y: 2.04,
      },
      {
        x: 4.55,
        y: 2.77,
      },
      {
        x: 4.9,
        y: 3.1,
      },
      {
        x: 5.1,
        y: 1.4,
      },
      {
        x: 7.1,
        y: 1.14,
      },
      {
        x: 9.18,
        y: 2.4,
      },
    ],
  },
  {
    name: "Line",
    type: "line",
    data: [
      {
        x: 0,
        y: 1.8,
      },
      {
        x: 1.8,
        y: 1.75,
      },
      {
        x: 2.3,
        y: 1.6,
      },
      {
        x: 3.1,
        y: 2.1,
      },
      {
        x: 3.8,
        y: 1.4,
      },
      {
        x: 5,
        y: 1.6,
      },
      {
        x: 6.1,
        y: 2.2,
      },
      {
        x: 8,
        y: 1.6,
      },
      {
        x: 8.2,
        y: 1.5,
      },
      {
        x: 9,
        y: 1.3,
      },
      {
        x: 11.2,
        y: 1.3,
      },
      {
        x: 11.5,
        y: 1.5,
      },
      {
        x: 12,
        y: 2.2,
      },
    ],
  },
]);
</script>

<template>
  <div class="text-black">
    <apexchart
      height="450"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
