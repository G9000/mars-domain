import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import { networks } from "../utils/networks";

//constant
const tld = ".mars";
const CONTRACT_ADDRESS = "0x29e127C3B3837810251B198e07E5E0f718B31515";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");
  const [network, setNetwork] = useState("");
  const [editing, setEditing] = useState(false);
  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, {
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
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // Call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints();
          }, 2000);

          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMints = async () => {
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
          names.map(async (name) => {
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

        console.log("MINTS FETCHED ", mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (network === "Polygon Mumbai Testnet") {
      fetchMints();
    }
  }, [currentAccount, network]);

  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

        fetchMints();
        setRecord("");
        setDomain("");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderNotConnectedContainer = () => (
    <div className="max-w-[1440px] w-full h-[400px] mx-auto flex flex-col items-center justify-center">
      <div className="text-white text-xl"> Wallet not Connected</div>
      <button
        onClick={connectWallet}
        className="bg-white text-black px-4 py-2 mt-6"
      >
        Connect Wallet
      </button>
    </div>
  );

  // Form to enter domain name and data
  const renderInputForm = () => {
    if (network !== "Polygon Mumbai Testnet") {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
          <button className="" onClick={switchNetwork}>
            Click here to switch
          </button>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-[400px] flex flex-col gap-y-6">
        <div className="w-full flex items-center gap-x-4">
          <input
            type="text"
            value={domain}
            placeholder="Enter your desire domain name"
            onChange={(e) => setDomain(e.target.value)}
            className="py-4 pl-6 w-full"
          />
          <p className="text-xl font-semibold text-white">{tld}</p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="Description of your domain"
          onChange={(e) => setRecord(e.target.value)}
          className="py-4 pl-6 w-full"
        />
        {editing ? (
          <div className="bg-white text-black">
            <button className="" disabled={loading} onClick={updateDomain}>
              Set record
            </button>
            <button
              className=""
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          // If editing is not true, the mint button will be returned instead
          <button
            className="bg-white text-black text-xl font-bold px-10 py-4"
            disabled={loading}
            onClick={mintDomain}
          >
            Mint
          </button>
        )}
      </div>
    );
  };

  const renderMints = () => {
    if (currentAccount && mints.length > 0) {
      return (
        <div className="max-w-[1440px] px-4 mx-auto my-20">
          <p className="subtitle text-white text-2xl font-bold">
            Aleardy register on mars
          </p>

          <div className="flex gap-6 mt-6">
            {mints.map((mint, index) => {
              return (
                <div
                  className="bg-white text-black p-[16px] w-[320px]"
                  key={index}
                >
                  <div className="bg-black flex flex-col justify-center items-center w-full p-4">
                    <a
                      className="text-white"
                      href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underlined text-xl font-semibold">
                        {" "}
                        {mint.name}
                        {tld}{" "}
                      </p>
                    </a>
                    {/* 
                    {mint.owner.toLowerCase() ===
                    currentAccount.toLowerCase() ? (
                      <button
                        className="bg-white text-black px-4 py-2 mt-6 rounded-lg"
                        onClick={() => editRecord(mint.name)}
                      >
                        Edit
                      </button>
                    ) : null} */}
                  </div>

                  <p className="text-center py-4"> {mint.record} </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const editRecord = (name) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Polygon Mumbai Testnet",
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex justify-between items-center py-10 px-4 max-w-[1440px] mx-auto">
        <Logo />
        <div className="flex">
          <div className="bg-white text-black px-2 rounded-full mr-6">
            {network.includes("Polygon") ? "Polygon" : "Eth"}
          </div>
          <div className="text-white">
            {currentAccount ? (
              <p>
                {" "}
                Wallet: {currentAccount.slice(0, 6)}...
                {currentAccount.slice(-4)}{" "}
              </p>
            ) : (
              <p> Not connected </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto">
        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}
        {mints && renderMints()}
      </main>
    </div>
  );
}

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="121"
      height="47"
      viewBox="0 0 151 77"
      fill="none"
    >
      <path
        d="M2.56 61V29H12.16V31.176C13.0347 30.5147 13.9307 29.9707 14.848 29.544C15.7653 29.1173 16.704 28.904 17.664 28.904C19.584 28.904 21.4293 29.2453 23.2 29.928C24.9707 30.6107 26.5493 31.6133 27.936 32.936C29.344 31.6133 30.9227 30.6107 32.672 29.928C34.4427 29.2453 36.288 28.904 38.208 28.904C41.0027 28.904 43.5413 29.5867 45.824 30.952C48.1067 32.296 49.92 34.1093 51.264 36.392C52.6293 38.6747 53.312 41.2027 53.312 43.976V61H43.712V43.976C43.712 42.952 43.4667 42.0347 42.976 41.224C42.4853 40.392 41.824 39.7307 40.992 39.24C40.16 38.7493 39.232 38.504 38.208 38.504C37.2053 38.504 36.288 38.7493 35.456 39.24C34.624 39.7307 33.9627 40.392 33.472 41.224C32.9813 42.0347 32.736 42.952 32.736 43.976V61H23.136V43.976C23.136 42.952 22.8907 42.0347 22.4 41.224C21.9093 40.392 21.248 39.7307 20.416 39.24C19.584 38.7493 18.6667 38.504 17.664 38.504C16.6613 38.504 15.7333 38.7493 14.88 39.24C14.048 39.7307 13.3867 40.392 12.896 41.224C12.4053 42.0347 12.16 42.952 12.16 43.976V61H2.56ZM81.7625 29H91.3625V61H81.7305L81.2825 58.12C80.4932 59.2293 79.4905 60.1253 78.2745 60.808C77.0798 61.4907 75.6825 61.832 74.0825 61.832C71.6932 61.832 69.4532 61.384 67.3625 60.488C65.2932 59.592 63.4692 58.3547 61.8905 56.776C60.3118 55.176 59.0745 53.3413 58.1785 51.272C57.3038 49.1813 56.8665 46.9413 56.8665 44.552C56.8665 42.2693 57.2825 40.136 58.1145 38.152C58.9465 36.168 60.1092 34.4293 61.6025 32.936C63.1172 31.4213 64.8558 30.2373 66.8185 29.384C68.8025 28.5307 70.9252 28.104 73.1865 28.104C75.0212 28.104 76.6852 28.488 78.1785 29.256C79.6932 30.0027 81.0372 30.9413 82.2105 32.072L81.7625 29ZM74.3705 52.616C75.7572 52.616 76.9838 52.2533 78.0505 51.528C79.1172 50.7813 79.9172 49.8 80.4505 48.584C81.0052 47.368 81.1865 46.024 80.9945 44.552C80.8025 43.2293 80.3225 42.024 79.5545 40.936C78.7865 39.848 77.8372 38.984 76.7065 38.344C75.5972 37.704 74.4132 37.384 73.1545 37.384C71.7892 37.384 70.5732 37.7467 69.5065 38.472C68.4612 39.1973 67.6718 40.168 67.1385 41.384C66.6052 42.6 66.4238 43.9547 66.5945 45.448C66.8078 46.7493 67.2878 47.944 68.0345 49.032C68.8025 50.12 69.7412 50.9947 70.8505 51.656C71.9598 52.296 73.1332 52.616 74.3705 52.616ZM119.316 38.856C118.74 38.408 118.089 38.056 117.364 37.8C116.638 37.5227 115.838 37.384 114.964 37.384C113.577 37.384 112.414 37.7253 111.476 38.408C110.558 39.0907 109.865 40.008 109.396 41.16C108.926 42.312 108.692 43.592 108.692 45V61H99.0275V29H108.628V31.944C109.63 30.8133 110.793 29.9067 112.116 29.224C113.438 28.52 114.964 28.168 116.692 28.168C117.438 28.168 118.153 28.1893 118.836 28.232C119.54 28.2533 120.212 28.36 120.852 28.552L119.316 38.856ZM135.189 61.576C133.567 61.4267 132.01 61.0747 130.517 60.52C129.023 59.9653 127.69 59.208 126.516 58.248C125.343 57.288 124.415 56.1147 123.733 54.728L131.797 51.272C132.01 51.5067 132.309 51.8053 132.693 52.168C133.077 52.5093 133.557 52.8187 134.133 53.096C134.73 53.3733 135.445 53.512 136.277 53.512C136.831 53.512 137.365 53.4587 137.877 53.352C138.41 53.224 138.837 53.0107 139.157 52.712C139.498 52.4133 139.669 51.9973 139.669 51.464C139.669 50.8667 139.445 50.4187 138.997 50.12C138.57 49.8 138.047 49.576 137.429 49.448C136.81 49.2987 136.234 49.1813 135.701 49.096C133.802 48.7973 131.978 48.2 130.229 47.304C128.501 46.3867 127.082 45.2027 125.973 43.752C124.863 42.28 124.309 40.5627 124.309 38.6C124.309 36.4027 124.863 34.504 125.973 32.904C127.103 31.304 128.586 30.0773 130.421 29.224C132.255 28.3493 134.229 27.912 136.341 27.912C138.837 27.912 141.141 28.424 143.253 29.448C145.386 30.472 147.135 31.944 148.501 33.864L140.949 38.344C140.693 38.024 140.373 37.704 139.989 37.384C139.626 37.0427 139.199 36.7547 138.708 36.52C138.239 36.264 137.727 36.104 137.173 36.04C136.426 35.976 135.754 36.008 135.157 36.136C134.581 36.2427 134.122 36.4773 133.781 36.84C133.439 37.1813 133.269 37.6827 133.269 38.344C133.269 38.9627 133.567 39.4107 134.165 39.688C134.762 39.9653 135.434 40.168 136.181 40.296C136.927 40.424 137.535 40.5627 138.005 40.712C139.839 41.3093 141.567 42.088 143.189 43.048C144.81 44.008 146.111 45.1707 147.093 46.536C148.095 47.9013 148.565 49.5013 148.501 51.336C148.501 53.4693 147.861 55.3467 146.581 56.968C145.301 58.5893 143.647 59.816 141.621 60.648C139.594 61.48 137.45 61.7893 135.189 61.576Z"
        fill="#FBFBFB"
      ></path>
    </svg>
  );
};
