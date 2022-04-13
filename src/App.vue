<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import Navbar from './components/Navbar.vue'
import { connectWallet, checkIfWalletIsConnected } from './hooks/connectWallet'
import { fetchMints } from './hooks/fetchMint'

const wallet = ref<string | null>(null)
const connectedAccount = ref<string | null>(null)
const connectedNetwork = ref<string | null>(null)
const CONTRACT_ADDRESS = "0xd0Ca70e59761fB04A45fe6D3678962fBcaEa5A76" as string
const pathfinderList = ref()

onBeforeMount( async () => {
    wallet.value = await connectWallet()
    const connectedWallet = await checkIfWalletIsConnected()
    connectedAccount.value = connectedWallet.account
    connectedNetwork.value = connectedWallet.network
    const pathfinder = await fetchMints(CONTRACT_ADDRESS)
    pathfinderList.value = pathfinder
})


</script>

<template>
    <Navbar :wallet="wallet" :network="connectedNetwork" />
    <Hero :wallet="wallet" :network="connectedNetwork"/>
    <Pathfinder v-if="wallet" :pathfinders="pathfinderList" />
</template>

<style>


#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--brandBlack);
}
</style>
