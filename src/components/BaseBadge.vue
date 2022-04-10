<script setup lang="ts">
import { computed } from 'vue'

interface propsType {
  text?: string;
  color?: 'primary' | 'secondary';
}

const { text = 'Badge', color = 'primary' } = defineProps<propsType>();
const badgeStyle = computed(() => {
  const badgeColor = color === "primary" ? "bg-brandOrange" : "bg-brandPurple";
  return `py-2 px-4 text-white text-[10px] ${badgeColor}`
})

</script>

<template>
    <span :class="badgeStyle">
        {{ text }}
    </span>
</template>