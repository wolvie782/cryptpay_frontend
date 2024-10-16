import { useAccount, useDisconnect } from "wagmi";
import "./TokenExchange.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
// import axios from "axios";

// USDT contract address on Goerli testnet
const USDT_CONTRACT_ADDRESS = "0xe802376580c10fe23f027e1e19ed9d54d4c9311e";

// ERC-20 ABI for interacting with USDT contract
const ERC20_ABI = [
  "function transfer(address to, uint amount) public returns (bool)",
];

function isEip1193Provider(provider: any): provider is ethers.Eip1193Provider {
  return provider && typeof provider.request === "function";
}

const TokenExchange = () => {
  const { address, isConnected } = useAccount();
  const [usdtValue, setUsdtValue] = useState("");
  const [gameCoinValue, setGameCoinValue] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  // Handle game token input change and update USDT value
  const handleGameCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/; // Allows only numbers and optional decimal points

    if (regex.test(value)) {
      setGameCoinValue(value);

      // Update USDT value based on the formula usdt = gamecoin * 1.04
      const usdt = value ? (parseFloat(value) * 1.04).toFixed(2) : "";
      setUsdtValue(usdt);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    navigate("/"); // Redirect to root after disconnecting
  };

  // Handle form submission and mint tokens
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !usdtValue || !address) {
      alert("Please connect your wallet and enter a valid Game Token amount.");
      return;
    }

    try {
      // Get signer from the connected wallet
      if (!window.ethereum || !isEip1193Provider(window.ethereum)) {
        alert("No Ethereum provider found. Please install MetaMask.");
        return;
      }

      
      // Create the provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get signer from the connected wallet
      const signer = await provider.getSigner();
      
      // Create a contract instance for the USDT token
      const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, ERC20_ABI, signer);
      
      // Convert USDT value to the smallest denomination (USDT uses 6 decimals)
      const usdtAmount = ethers.parseUnits(usdtValue, 6); // Convert to smallest unit (micro-USDT)
      
      // Send USDT transaction
      const tx = await usdtContract.transfer('0x0B7Ce99a9115fB58a3dF4461F141135299FFf0F8', usdtAmount);
      console.log("Working");
      // console.log('S7 Wallet Address :- ', process.env.REACT_APP_SECTOR_SEVEN_WALLET)

      // Wait for transaction confirmation
      await tx.wait();

      // Make an API call to mint the tokens
      // const response = await axios.post(
      //   `${process.env.REACT_APP_API_URL}/purchase-tokens`,
      //   {
      //     userWallet: address,
      //     usdtAmount: usdtValue,
      //   }
      // );

      // Set the transaction hash from the response
      setTransactionHash(null);
      alert("Tokens minted and transferred to your wallet.");
    } catch (error: any) {
      console.error("Error during transaction:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="token-exchange flex flex-col justify-center items-center p-6 bg-gray-900 min-h-screen w-full">
      {isConnected && (
        <div className="crypto-container flex flex-col gap-5 justify-center items-center w-full max-w-md">
          <div className="wallet-info flex flex-col justify-center items-center">
            <p className="text-teal-200 text-lg">Connected: {address}</p>
            <button
              className="disconnect-btn bg-red-500 text-white py-2 px-4 mt-3 rounded-md hover:bg-red-600"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </button>
          </div>

          <form
            className="exchange-form w-full bg-gray-800 p-6 rounded-md"
            onSubmit={handleSubmit}
          >
            <div className="form-group mb-4">
              <label className="block text-teal-200 mb-1" htmlFor="game-token">
                Game Token
              </label>
              <input
                type="text"
                value={gameCoinValue}
                placeholder="Enter Game Token amount"
                className="w-full p-2 rounded-md"
                id="game-token"
                onChange={handleGameCoinChange}
              />
            </div>

            <div className="form-group mb-4">
              <label className="block text-teal-200 mb-1" htmlFor="usdt">
                USDT
              </label>
              <input
                type="text"
                value={usdtValue}
                placeholder="USDT equivalent"
                className="w-full p-2 rounded-md"
                id="usdt"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="submit-btn w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>

          {/* Display transaction hash if available */}
          {transactionHash && (
            <div className="transaction-info text-teal-200 mt-4">
              <p>Minting Transaction Hash: {transactionHash}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenExchange;
