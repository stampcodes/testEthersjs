import { Contract } from "ethers";
import { BrowserProvider } from "ethers";
import erc20abi from "../erc20abi.json";
const transfer = () => {
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
            <input type="text" name="amount" placeholder="Amount to transfer" />
          </div>
          <footer>
            <button type="submit">Transfer</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default transfer;
