import { useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

// Estendere l'interfaccia Window per includere ethereum
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
          const address = await signer.getAddress(); // Ottieni l'indirizzo del signer
          const balance = await provider.getBalance(address); // Usa l'indirizzo per ottenere il saldo
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
