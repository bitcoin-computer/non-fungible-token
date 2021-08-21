import { useState, useEffect } from "react";

interface Props {
  computer: any;
}

const Wallet = ({ computer }: Props) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchRevs = async () => {
      setBalance(await computer.db.wallet.getBalance());
    };
    fetchRevs();
  }, [computer.db.wallet]);

  return (
    <>
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}
      <br />
      <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}
      <br />
      <b>Balance</b>&nbsp;{balance / 1e8} {computer.db.wallet.restClient.chain}
      <br />
    </>
  );
};

export default Wallet;
