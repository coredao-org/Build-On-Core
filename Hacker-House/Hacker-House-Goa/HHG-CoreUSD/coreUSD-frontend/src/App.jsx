import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Homepage/Layout";
import LayoutLB from "./components/LendingBorrowing/LayoutLB";
import AboutUs from "./components/About/AboutUs";
import LayoutStake from "./components/Stake/LayoutStake";
import LayoutSwap from "./components/Swap/LayoutSwap";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen overflow-auto no-scrollbar">
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/product" element={<LayoutLB />} />
          <Route path="/restake" element={<LayoutStake />} />
          <Route path="/swap" element={<LayoutSwap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
