export default function TxList({ txs }: any) {
  if (txs.length === 0) return null;
  return (
    <>
      {txs.map((item: any) => (
        <div key={item.txHash}>
          <div>
            <p>From: {item.from}</p>
            <p>To: {item.to}</p>
            <p>Amount: {item.amount}ciiaoaoao</p>
            <a href={`https://sepolia.etherscan.io//tx/${item.txHash}`}>
              Check in block explorer
            </a>
          </div>
        </div>
      ))}
    </>
  );
}
