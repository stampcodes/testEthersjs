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

  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  const getContractInfo = async (event: any) => {
    event.preventDefault();
    const provider = new BrowserProvider(window.ethereum);
    const formData = new FormData(event.target);
    const address = formData.get("addr") as string;
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

  const getMyBalance = async () => {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const contract = new Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await contract.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: formatEther(balance),
    });
    return formatEther(balance);
  };

  const handleTransfer = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new Contract(contractInfo.address, erc20abi, signer);
    await contract.transfer(data.get("recipient"), data.get("amount"));
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

      <button type="submit" onClick={getMyBalance} className="btn">
        Get my balance
      </button>
      <div>
        <h2>My Balance</h2>
        <p>
          {balanceInfo.balance} {contractInfo.tokenSymbol}
        </p>
      </div>
      <div>
        <div>
          <h1>Write to contract</h1>

          <form onSubmit={handleTransfer}>
            <div>
              <input
                type="text"
                name="recipient"
                placeholder="Recipient address"
              />
            </div>
            <div>
              <input
                type="text"
                name="amount"
                placeholder="Amount to transfer"
              />
            </div>
            <footer>
              <button type="submit">Transfer</button>
            </footer>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoContract;
