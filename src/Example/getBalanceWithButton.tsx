import { useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

const AccountBalance: React.FC = () => {
  const [balance, setBalance] = useState<string>("");

  const getBalance = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    setBalance(formatEther(balance));
  };

  return (
    <div>
      <h2>Account Balance</h2>
      <p>{balance} ETH</p>
      <button onClick={getBalance}>Aggiorna Saldo</button>
    </div>
  );
};

export default AccountBalance;
