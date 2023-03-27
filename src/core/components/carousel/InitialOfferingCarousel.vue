<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  images: Array,
  small: Boolean,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const inner = ref(null);
const currentIndex = ref(0);
const cardWidth = ref(0);
const left = computed(() => -cardWidth.value * currentIndex.value);
onMounted(() => {
  cardWidth.value = inner.value.clientWidth / 4;
  const observer = new ResizeObserver(setAnimHeight);
  observer.observe(inner.value, { box: "border-box" });
});
const setAnimHeight = () => {
  if (inner.value) {
    cardWidth.value = inner.value.clientWidth / 4;
  }
};
const next = () => {
  if (currentIndex.value >= props.images.length - 1) return;
  currentIndex.value++;
};
const prev = () => {
  if (currentIndex.value < 1) return;
  currentIndex.value--;
};
const select = (index) => {
  currentIndex.value = index;
};
</script>

<template>
  <div class="relative w-full h-full px-10 pb-6">
    <div class="h-full overflow-hidden" ref="inner">
      <div
        class="flex h-full transition-all relative"
        :style="{ left: left + 'px' }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="absolute w-1/4 h-full"
          :style="{ left: `${25 * index}%` }"
        >
          <div class="h-full px-2.5">
            <nftmx-img :src="image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute w-full h-full top-0 left-0">
      <div class="absolute right-4 h-full flex items-center">
        <font-awesome-icon
          v-if="currentIndex < images.length - 4"
          :icon="['fas', 'angle-right']"
          class="text-white text-3xl cursor-pointer hover:text-primary-900 transition"
          @click="next"
        />
      </div>
      <div class="absolute left-4 h-full flex items-center">
        <font-awesome-icon
          v-if="currentIndex > 0"
          :icon="['fas', 'angle-left']"
          class="text-white text-3xl cursor-pointer hover:text-primary-900 transition"
          @click="prev"
        />
      </div>
      <div :class="['absolute w-full  px-2 bottom-0 overflow-x-auto']">
        <div class="flex gap-3 h-full transition-all relative mx-auto w-fit">
          <div
            v-for="(image, index) in images.length - 3"
            :key="index"
            :class="[
              index === currentIndex ? 'bg-primary-900' : 'bg-tertiary-400',
              'cursor-pointer w-4.5 h-2 rounded-full',
            ]"
            @click="select(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
