import { useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

const printBalance: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const getBalance = async () => {
        try {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          setBalance(formatEther(balance));
        } catch (error) {
          console.error("Errore nell'ottenere il saldo:", error);
        }
      };

      getBalance();
    } else {
      console.log("Ethereum provider non trovato.");
    }
  }, []);

  return (
    <div>
      <h2>Account Balance</h2>
      <p>{balance} ETH</p>
    </div>
  );
};

export default printBalance;
