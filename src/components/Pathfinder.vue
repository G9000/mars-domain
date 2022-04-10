<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface pathfinderType {
    id: number;
    name: string;
    owner: string;
    record: string;
}

interface propsType {
  pathfinders: pathfinderType[];
}

const props = defineProps<propsType>();
const openSeaLink = (id: number) => {
  return `https://testnets.opensea.io/assets/mumbai/0xd0Ca70e59761fB04A45fe6D3678962fBcaEa5A76/${id}`
}

</script>

<template>
    <div class="flex flex-col items-center py-10" style="margin-top: -160px">
        <h2 class="font-chakra text-white text-4xl tracking-wider">PATHFINDER</h2>
        <h4 class="mt-6 text-brandGrey">The first generation Pathfinder lists</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[120px]">
            <template v-for="(pathfinder, index) in props.pathfinders" :key="index">
                <div class="w-[287px] h-[220px] flex flex-col justify-between bg-white rounded-lg border-2 card">
                    <div class="flex flex-col gap-y-4 p-6">
                        <div class="flex">
                            <div class="text-3xl font-bold text-white">{{pathfinder.name}}.</div>
                            <div class="text-3xl font-bold text-brandOrange">mars</div>
                        </div>
                        <p style="color:hsla(0, 5%, 71%, 1);">{{pathfinder.record}}</p>
                    </div>
                    <a :href="openSeaLink(pathfinder.id)" class="bg-brandOrange px-4 pt-8 pb-4 rounded-b-lg text-white flex items-center gap-x-4 justify-end w-full">
                        <span class="font-chakra font-semibold">Check on OpenSea</span>
                        <BaseIcon name="metamask" size="small">
                            <OpenSea />
                        </BaseIcon> 
                    </a>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>

.card {
    border-color: hsla(22, 29%, 77%, 0.25);
    background: linear-gradient(180deg, rgba(64, 64, 64, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
}

</style>