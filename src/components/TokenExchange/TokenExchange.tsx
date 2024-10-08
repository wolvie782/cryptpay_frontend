import { useAccount, useDisconnect } from "wagmi";
import './TokenExchange.css';

const TokenExchange = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="token-exchange flex flex-col justify-center items-center p-6 bg-gray-900 min-h-screen w-full">
      <h1 className="text-3xl mb-5 text-teal-200">Crypto Wallet</h1>

      {isConnected ? (
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


          <form className="exchange-form w-full bg-gray-800 p-6 rounded-md">
            <div className="form-group mb-4">
              <label className="block text-teal-200 mb-1" htmlFor="usdt">USDT</label>
              <input 
                type="text" 
                placeholder="Enter USDT amount"
                className="w-full p-2 text-black rounded-md"
                id="usdt"
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="block text-teal-200 mb-1" htmlFor="game-token">Game Token</label>
              <input 
                type="text" 
                placeholder="Equivalent Game Tokens"
                className="w-full p-2 text-black rounded-md"
                id="game-token"
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <p className="text-teal-200">No wallet connected. Please connect your wallet.</p>
      )}
    </div>
  );
};

export default TokenExchange;
