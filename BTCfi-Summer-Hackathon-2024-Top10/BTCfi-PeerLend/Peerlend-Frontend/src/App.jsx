import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from "react-router-dom";
import Home from "./pages/Home"
import { configWeb3Modal } from "./connection";
// import HomeLayout from "./layout/HomeLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Portfolio from "./pages/Dashboard/Portfolio";
import Explore from "./pages/Dashboard/Explore";
import ExploreDetails from "./pages/Dashboard/ExploreDetails";
import PortfolioDetails from './pages/Dashboard/PortfolioDetails'
import VerifyMail from "./pages/Auth/VerifyMail";
import VerifyLayout from "./layout/VerifyLayout";

import { ToastContainer } from 'react-toastify';
import '@coinbase/onchainkit/styles.css';
import OnchainProviders from "./Hooks/OnchainProvider";

configWeb3Modal();


const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    {/* <Route path="/" element={<HomeLayout />} > */}
    <Route index element={<Home />} />
    {/* </Route> */}
    <Route path="/verifymail" element={<VerifyLayout />}>
      <Route index element={<VerifyMail />} />
    </Route>
    <Route path='/dashboard' element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="portfolio/:id" element={<PortfolioDetails />} />
      <Route path="explore" element={<Explore />} />
      <Route path="explore/:id" element={<ExploreDetails />} />
    </Route>
  </Route>
))

function App() {

  return (
    <div className="text-[#FFF] mx-auto lg:max-w-[1440px] md:max-w-[1440px] font-roboto-serif font-[100]">
      <ToastContainer />
      <OnchainProviders>
        <RouterProvider router={router} />
      </OnchainProviders>
    </div>
  )
}

export default App