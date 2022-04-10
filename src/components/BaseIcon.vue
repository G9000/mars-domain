<script setup lang="ts">
import { computed } from 'vue'

interface propsType {
  name: string;
  size?: "small" |"base";
  color?: "light" | "dark" | "transparent";
}

const props = defineProps<propsType>();

const iconSize = computed(() => {
    return props.size === "base" ? 28 : 24;
})

const iconColor = computed(() => {
    switch(props.color) {
        case "light":
            return "fill-brandOrange";
        case "dark":
            return "fill-brandBlack";
        case "transparent":
            return "fill-transparent";
        default:
            return "fill-white";
    }
})

</script>


<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 28 28"
    :aria-labelledby="name"
    role="presentation"
  >
    <title :id="props.name" lang="en">{{ props.name }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<style scoped>
    svg {
    display: inline-block;
    vertical-align: baseline;
    margin-bottom: -2px;
    }
</style>