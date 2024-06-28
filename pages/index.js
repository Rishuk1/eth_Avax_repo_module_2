import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [minimumBalance, setMinimumBalance] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      const tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const freezeContract = async () => {
    if (atm) {
      const tx = await atm.freezeContract();
      await tx.wait();
      alert("Contract frozen!");
    }
  };

  const unfreezeContract = async () => {
    if (atm) {
      const tx = await atm.unfreezeContract();
      await tx.wait();
      alert("Contract unfrozen!");
    }
  };

  const setMinimumBalanceFunc = async () => {
    if (atm) {
      const newMinBalance = parseInt(minimumBalance);
      const tx = await atm.setMinimumBalance(newMinBalance);
      await tx.wait();
      alert("Minimum balance set!");
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={freezeContract}>Freeze Contract</button>
        <button onClick={unfreezeContract}>Unfreeze Contract</button>
        <div>
          <input
            type="text"
            placeholder="Minimum Balance"
            value={minimumBalance}
            onChange={(e) => setMinimumBalance(e.target.value)}
          />
          <button onClick={setMinimumBalanceFunc}>Set Minimum Balance</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #6a0dad; /* Purple background */
          color: white;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        button {
          background-color: white;
          color: black;
          border: none;
          padding: 10px 20px;
          margin: 10px;
          cursor: pointer;
          font-size: 16px;
          border-radius: 5px;
        }
        button:hover {
          background-color: #ddd;
        }
        input {
          padding: 10px;
          margin: 10px;
          font-size: 16px;
          border-radius: 5px;
          border: none;
        }
      `}</style>
    </main>
  );
}
