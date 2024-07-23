import { useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import erc20abi from "../erc20abi.json";
import "./App.css";

interface ContractInfo {
  address: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
}

const InfoContract: React.FC = () => {
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });

  const getContractInfo = async (event: any) => {
    event.preventDefault();
    const provider = new BrowserProvider(window.ethereum);
    const formData = new FormData(event.target);
    const address = formData.get("addr") as string; // Ottieni l'indirizzo dal form
    const contract = new Contract(address, erc20abi, provider);

    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();

    setContractInfo({
      address: address,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      totalSupply: formatEther(totalSupply.toString()),
    });
  };

  return (
    <>
      <form onSubmit={getContractInfo}>
        <h1>InfoContract</h1>
        <input type="text" name="addr" placeholder="Contract Address" />
        <div>
          <h2>Address</h2>
          <p>{contractInfo.address}</p>
        </div>
        <div>
          <h2>Token Name</h2>
          <p>{contractInfo.tokenName}</p>
        </div>
        <div>
          <h2>Token Symbol</h2>
          <p>{contractInfo.tokenSymbol}</p>
        </div>
        <div>
          <h2>Total Supply</h2>
          <p>{contractInfo.totalSupply}</p>
        </div>
        <button type="submit">Get Info</button>
      </form>
    </>
  );
};

export default InfoContract;
