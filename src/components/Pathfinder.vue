<script setup lang="ts">
import { onBeforeMount, inject, ref } from "vue";
import { fetchMints } from "../hooks/fetchMint";
import PathfinderCard from "./PathfinderCard.vue";
import { pathfinderType } from "../types/main";

const CONTRACT_ADDRESS = inject("CONTRACT_ADDRESS") as string;
const pathfindersData = ref<pathfinderType[]>();

const res = await fetchMints(CONTRACT_ADDRESS);
pathfindersData.value = res;

// todo: add caching
// todo: filter/lazy load data
</script>

<template>
  <div
    class="flex flex-col items-center py-[120px] bg-brandBlack"
    style="margin-top: -160px"
  >
    <h2 class="font-chakra font-bold text-white text-4xl tracking-wider">
      PATHFINDER
    </h2>
    <h4 class="mt-6 text-brandGrey">The first generation Pathfinder lists</h4>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-[120px]"
    >
      <template v-for="pathfinder in pathfindersData" :key="pathfinder.id">
        <PathfinderCard :pathfinders="pathfinder" />
      </template>
    </div>
  </div>
</template>
