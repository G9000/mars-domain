<script setup lang="ts">
import { computed } from 'vue'

interface propsType {
  label: string;
  size?: "small" | "base";
  color: "primary" | "secondary";
}

const props = defineProps<propsType>();
const emit = defineEmits(["click"]);
const onClick = () => {
  emit("click");
};

const btnColor = computed(() => {
    return props.color === 'primary' ? 'bg-brandOrange' : 'bg-brandPurple';
})

const btnSize = computed(() => {
  return props.size === 'base' ? 'text-base md:text-xl' : 'text-base';
})

const btnClass = computed(() => {
    return `${btnColor.value} ${btnSize.value} text-white inline-flex items-center justify-center gap-x-4 text-2xl tracking-widest font-bold py-4 px-8`;
})

</script>

<template>
    <button type="button" :class="btnClass" @click="onClick">
      <span>{{ props.label }}</span>
      <slot />
    </button>
</template>