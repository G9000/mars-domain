import { ethers } from "ethers";
import contractAbi from "../../utils/contractABI.json";
import { fetchMints } from "../hooks/fetchMint";

export const mintDomain = async (payload: {
  name: string;
  details: string;
  address: string;
}) => {
  // Calculate price based on length of domain (change this to match your contract)
  // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
  const price =
    payload.name.length === 3
      ? "0.5"
      : payload.name.length === 4
      ? "0.3"
      : "0.1";

  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        payload.address,
        contractAbi.abi,
        signer
      );

      console.log("Paying gas fees");

      let tx = await contract.register(payload.name, {
        value: ethers.utils.parseEther(price),
      });
      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
        );

        // Set the record for the domain
        tx = await contract.setRecord(payload.name, payload.details);
        await tx.wait();

        console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

        // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints(payload.address);
        }, 2000);

        console.log("sucesss");
        return { code: 200, data: tx.hash };
      } else {
        console.log("fail");
        return { code: 500, data: null };
      }
    }
  } catch (error) {
    console.log("error");
    return { code: 400, data: error };
  }
};
