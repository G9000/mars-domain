import { networks } from '../../utils/networks'

export const getWallet = () => {
  window.open("https://metamask.io/download/")
}

export const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("No wallet detected")
        return null
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Wallet detected connected");
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
};

export const checkIfWalletIsConnected = async () => {
  const { ethereum } = window;
  const accounts = await ethereum.request({ method: "eth_accounts" })

  if (accounts.length === 0) {
    console.log("No authorized account found")
  }

  const chainId = await ethereum.request({ method: "eth_chainId" })

  ethereum.on("chainChanged", handleChainChanged)
  function handleChainChanged(_chainId: any) {
    window.location.reload()
  }

  return { account: accounts[0], network:networks[chainId] }
}