import { ethers } from "ethers";
import { pathfinderType } from "../types/main";
import contractAbi from "../../utils/contractABI.json";

export const fetchMints = async (CONTRACT_ADDRESS: string) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // You know all this
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      // Get all the domain names from our contract
      const names = await contract.getAllNames();

      // For each name, get the record and the address
      const mintRecords = await Promise.all(
        names.map(async (name: object) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        })
      );
      return mintRecords as pathfinderType[];
    }
  } catch (error) {
    console.log(error);
  }
};
