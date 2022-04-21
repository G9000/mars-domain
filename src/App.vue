<script setup lang="ts">
import { ref, onBeforeMount, provide } from "vue";
import { connectWallet, checkIfWalletIsConnected } from "./hooks/connectWallet";

const wallet = ref<string | null>(null);
const connectedAccount = ref<string | null>(null);
const connectedNetwork = ref<string | null>(null);
provide("CONTRACT_ADDRESS", "0xd0Ca70e59761fB04A45fe6D3678962fBcaEa5A76");

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
