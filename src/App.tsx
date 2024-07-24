import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import erc20abi from "./erc20abi.json";
import "./App.css";

interface ContractInfo {
  address: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
}

const InfoContract: React.FC = () => {
  const [txs, setTxs] = useState<any[]>([]);
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

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractInfo.address, erc20abi, provider);

      console.log("Setting up event listener for Transfer");

      contract.on("Transfer", (from, to, amount, event) => {
        console.log("Transfer event detected:", { from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount),
          },
        ]);
      });

      return () => {
        console.log("Removing event listeners for Transfer");
        contract.removeAllListeners("Transfer");
      };
    }
  }, [contractInfo.address]);

  const getContractInfo = async (event: any) => {
    event.preventDefault();
    const provider = new BrowserProvider(window.ethereum);
    const formData = new FormData(event.target);
    const address = formData.get("addr") as string;
    const contract = new Contract(address, erc20abi, provider);

    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();

    console.log("Contract info retrieved:", {
      address,
      tokenName,
      tokenSymbol,
      totalSupply,
    });

    setContractInfo({
      address: address,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      totalSupply: totalSupply.toString(),
    });
  };

  const getMyBalance = async () => {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const contract = new Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await contract.balanceOf(signerAddress);

    console.log("Balance info retrieved:", { signerAddress, balance });

    setBalanceInfo({
      address: signerAddress,
      balance: balance.toString(),
    });
  };

  const handleTransfer = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new Contract(contractInfo.address, erc20abi, signer);
    await contract.transfer(data.get("recipient"), data.get("amount"));

    console.log("Transfer executed:", {
      recipient: data.get("recipient"),
      amount: data.get("amount"),
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

      <button type="button" onClick={getMyBalance} className="btn">
        Get my balance
      </button>
      <div>
        <h2>My Balance</h2>
        <p>
          {balanceInfo.balance} {contractInfo.tokenSymbol}
        </p>
      </div>
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
            <input type="text" name="amount" placeholder="Amount to transfer" />
          </div>
          <footer>
            <button type="submit">Transfer</button>
          </footer>
        </form>
      </div>
      <div>
        <h1>Recent transactions</h1>
        {txs.length > 0 ? (
          txs.map((item: any) => (
            <div key={item.txHash}>
              <div>
                <p>From: {item.from}</p>
                <p>To: {item.to}</p>
                <p>Amount: {item.amount}</p>
                <a href={`https://sepolia.etherscan.io/tx/${item.txHash}`}>
                  Check in block explorer
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </>
  );
};

export default InfoContract;
