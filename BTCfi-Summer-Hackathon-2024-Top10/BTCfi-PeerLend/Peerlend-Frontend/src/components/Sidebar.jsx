import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { TbTransactionBitcoin } from "react-icons/tb";
import logo from '../assets/logo.svg'

const Sidebar = () => {
  
  const activeStyle = {
    backgroundColor: '#E0BB83',
    fontWeight: 'bold',
    color: '#0A0D17',
    width: '100%',
    padding: '20px 30px'
  };

  return (
    <div className="w-[20%] h-[100vh] border-r border-[#E0BB83]/20">
        <div className="w-[100%] hidden py-8 lg:flex md:flex flex-col">
        <p className='text-[18px] flex items-center mt-4 mb-14 ml-4'><img src={logo} alt="" className='w-[40px] h-[40px] '/>
        PeerLend</p>
      <NavLink
        to="/dashboard"
        end
        className="flex items-center py-4 px-8 my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <MdDashboard className="mr-2" /> Dashboard
      </NavLink>
      <NavLink
        to="portfolio"
        className="flex items-center py-4 px-8 my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <TbTransactionBitcoin className="mr-2" /> Portfolio
      </NavLink>
      <NavLink
        to="explore"
        className="flex items-center py-4 px-8 my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <RiCompassDiscoverFill className="mr-2" /> Explore
      </NavLink>
      <div className="mt-36">
        <button className="flex items-center py-4 px-8" onClick={() => disconnect()}>
          <IoLogOut className="mr-2" /> Log Out
        </button>
      </div>
      </div>
      <div className="lg:hidden md:hidden h-[100vh] py-8 flex flex-col items-center border-r border-[#E0BB83]/20">
      <img src={logo} alt="" className='w-[40px] h-[40px] mb-12'/>
      <NavLink
        to="/dashboard"
        end
        className="py-4 px-2  my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <MdDashboard className="mr-2 text-xl" />
      </NavLink>
      <NavLink
        to="portfolio"
        className="py-4 px-2 my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <TbTransactionBitcoin className="mr-2 text-xl" />
      </NavLink>
      <NavLink
        to="explore"
        className="py-4 px-2 my-4"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <RiCompassDiscoverFill className="mr-2 text-xl" />
      </NavLink>
      <div className="mt-auto">
        <button className="py-4 px-8 my-4" onClick={() => disconnect()}>
          <IoLogOut className="mr-2 text-xl" />
        </button>
      </div>
      </div>
    </div>
  );
}

export default Sidebar;
