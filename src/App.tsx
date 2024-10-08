import './App.css';
import { Routes, Route } from 'react-router-dom'; 
import Home from './components/Home/Home';
import TokenExchange from './components/TokenExchange/TokenExchange';
import CreditCard from './components/CardExchange/CardExchange';

function App() {
  return (
    <div className="app bg-black text-white h-screen w-screen flex justify-center items-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crypto-wallet" element={<TokenExchange />} />
        <Route path="/credit-card" element={<CreditCard />} />
      </Routes>
    </div>
  );
}

export default App;
