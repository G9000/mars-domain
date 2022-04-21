<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseIcon from "./BaseIcon.vue";
import { getWallet } from "../hooks/connectWallet";
import { mintDomain } from "../hooks/mintDomain";

interface propsType {
  wallet?: string;
  network: string;
}
const props = defineProps<propsType>();
const domain = reactive({
  name: "",
  details: "",
});

// const btnColor = computed(() => {
//     return props.wallet ? "primary" : "secondary"
// })

const helperText = computed(() => {
  return props.wallet
    ? {
        // text: "MINT DOMAIN",
        first: "Insuficient matic? ",
        second: "Tap into our initiative funds",
        href: "https://faucet.polygon.technology/",
      }
    : {
        // text: "CONNECT METAMASK",
        first: "Meta what? ",
        second: "Learn more about Metamask",
        href: "https://metamask.io",
      };
});

const isMinting = ref<boolean>(false);
const isError = ref<boolean>(false);
const errorMsg = ref<string>("");
const minting = async () => {
  if (domain.name.length > 3) {
    isMinting.value = true;
    console.log("Domain proncessing");
    const mintRes = await mintDomain(domain);

    if (mintRes && mintRes.code === 200) {
      isMinting.value = false;
    } else if (mintRes && mintRes.code === 400) {
      isMinting.value = false;
      console.log("You kinda poor");
      isError.value = true;
      errorMsg.value = "Insufficient fund";
    } else if (mintRes && mintRes.code === 500) {
      isMinting.value = false;
      console.log("Sun fried our system");
      isError.value = true;
      errorMsg.value =
        "It’s look like we have encountered a problem. Apologize for the inconvenience. Must be the solar wind.";
    }
  } else {
    isError.value = true;
    errorMsg.value = "Domain name is too short";
  }
};

const resetForm = () => {
  isMinting.value = false;
  isError.value = false;
  errorMsg.value = "";
  domain.name = "";
  domain.details = "";
};

function goTestnet() {
  window
    .open(
      "https://medium.com/stakingbits/how-to-connect-polygon-mumbai-testnet-to-metamask-fc3487a3871f",
      "_blank"
    )
    ?.focus();
}
</script>

<template>
  <div
    class="min-h-screen h-full w-full flex items-center justify-center bg-top bg-contain bg-no-repeat px-6 md:px-10"
    style="background-image: url('/src/assets/mars.png')"
  >
    <div class="h-screen flex items-center justify-center w-full">
      <div class="flex flex-col items-center gap-y-6">
        <h1 class="font-chakra text-white font-bold tracking-wide text-center">
          CLAIM YOUR MARS DOMAIN
        </h1>

        <div v-if="!isError" class="mt-4">
          <div v-if="!isMinting" class="flex flex-col gap-y-4">
            <form
              class="flex flex-col gap-y-4 text-white"
              autocomplete="off"
              @submit.prevent="minting"
            >
              <div class="flex items-center w-full h-[50px]">
                <div class="p-4 h-full w-full bg-black">
                  <label for="domainName" class="hidden-visually"
                    >Domain name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your desire domain name"
                    class="h-full w-full bg-transparent focus:outline-none"
                    id="domainName"
                    aria-label="domain name"
                    v-model="domain.name"
                  />
                </div>
                <div
                  class="flex items-center text-3xl h-full font-bold px-4 bg-brandOrange text-[#88390D]"
                >
                  .mars
                </div>
              </div>
              <div class="p-4 h-full w-full bg-black">
                <label for="domainDetails" class="hidden-visually"
                  >Domain details:
                </label>
                <textarea
                  type="text"
                  placeholder="Give some description for your domain name"
                  class="h-full w-full bg-transparent focus:outline-none"
                  id="domainDetails"
                  v-model="domain.details"
                />
              </div>
              <BaseButton
                v-if="
                  props.wallet && props.network !== 'Polygon Mumbai Testnet'
                "
                label="CONNECT TO TESTNET"
                color="primary"
                size="base"
                @click="goTestnet()"
              >
                <BaseIcon name="metamask" size="base">
                  <Star />
                </BaseIcon>
              </BaseButton>
              <BaseButton
                v-if="
                  props.wallet && props.network === 'Polygon Mumbai Testnet'
                "
                label="MINT DOMAIN"
                color="primary"
                size="base"
                type="submit"
                value="Submit"
              >
                <BaseIcon name="metamask" size="base">
                  <Star />
                </BaseIcon>
              </BaseButton>
              <BaseButton
                v-else-if="!props.wallet"
                label="CONNECT METAMASK"
                color="secondary"
                size="base"
                @click="getWallet()"
              >
                <BaseIcon name="metamask" size="base">
                  <Metamask />
                </BaseIcon>
              </BaseButton>
            </form>
            <span class="text-gray-300 text-center"
              >{{ helperText.first
              }}<a
                :href="helperText.href"
                target="_blank"
                class="font-semibold text-white"
                >{{ helperText.second }}</a
              ></span
            >
          </div>

          <div
            v-else
            class="mt-6 bg-brandOrange py-2 px-6 text-white font-bold tracking-wider text-xl md:text-2xl"
          >
            Minting . . .
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center mt-6 gap-x-4 py-6 bg-brandOrange max-w-[460px]"
        >
          <div
            class="px-6 flex items-center h-full text-white tracking-wider text-base md:text-md text-center"
          >
            <span>{{ errorMsg }}</span>
          </div>
          <button
            class="bg-brandOrange h-full px-6 text-white mt-4 md:mt-8 underline"
            @click="resetForm"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .spinner {
  width: 10em;
  height: 10em;
  border-top: 1em solid #d5fff7;
  border-right: 1em solid transparent;
  animation: spinner 0.4s linear infinite;
  border-radius: 50%;
  margin: auto;
}
.head {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin-left: 8.5em;
  margin-top: 0.5em;
  background-color: #d5fff7;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
} */
</style>
