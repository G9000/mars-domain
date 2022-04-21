<script setup lang="ts">
import { ref, onBeforeMount, provide } from "vue";
import { connectWallet, checkIfWalletIsConnected } from "./hooks/connectWallet";

const wallet = ref<string | null>(null);
const connectedAccount = ref<string | null>(null);
const connectedNetwork = ref<string | null>(null);
provide("CONTRACT_ADDRESS", "0xdd93312B4bB4492b6483E6321E585ed8f552491A");

onBeforeMount(async () => {
  wallet.value = await connectWallet();
  const connectedWallet = await checkIfWalletIsConnected();
  connectedAccount.value = connectedWallet.account;
  connectedNetwork.value = connectedWallet.network;
});
</script>

<template>
  <Navbar :wallet="wallet" :network="connectedNetwork" />
  <Hero :wallet="wallet" :network="connectedNetwork" />
  <Suspense>
    <template #default>
      <Pathfinder v-if="wallet" />
    </template>
    <template #fallback>
      <div class="text-4xl text-white">asdsadasdadsa</div>
    </template>
  </Suspense>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--brandBlack);
}
</style>
