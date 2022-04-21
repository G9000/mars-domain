<script setup lang="ts">
import { onBeforeMount, inject, ref } from "vue";
import BaseIcon from "./BaseIcon.vue";
import { pathfinderType } from "../types/main";

const props = defineProps<{
  pathfinders: pathfinderType;
}>();
const CONTRACT_ADDRESS = inject("CONTRACT_ADDRESS") as string;

const openSeaLink = (id: number) => {
  return `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${id}`;
};
</script>

<template>
  <div class="w-[287px] flex flex-col justify-between bg-white rounded-lg card">
    <div class="flex flex-col gap-y-4 p-6">
      <div class="flex flex-wrap text-2xl">
        <div class="font-bold text-white">{{ props.pathfinders.name }}.</div>
        <div class="font-bold text-brandOrange">mars</div>
      </div>
      <p style="color: hsla(0, 5%, 71%, 1)">{{ props.pathfinders.record }}</p>
    </div>
    <a
      :href="openSeaLink(props.pathfinders.id)"
      class="bg-brandOrange px-4 pt-8 pb-4 rounded-b-lg text-white flex items-center gap-x-4 justify-end w-full"
    >
      <span class="font-chakra font-semibold">Check on OpenSea</span>
      <BaseIcon name="OpenSea" size="base">
        <OpenSea />
      </BaseIcon>
    </a>
  </div>
</template>

<style scoped>
.card {
  border-color: hsla(22, 29%, 77%, 0.25);
  background: linear-gradient(
    180deg,
    rgba(64, 64, 64, 0.3) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
