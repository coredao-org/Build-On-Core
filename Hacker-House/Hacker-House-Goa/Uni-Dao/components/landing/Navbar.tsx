import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div className="text-white w-full justify-between items-center z-20 fixed flex flex-row bg-transparent pt-9 px-8 sm:px-24">
      {/* Logo Section */}
      <div className="Logo w-[30%] flex justify-start">
        <a href="#home" className="hover:text-white text-white/85">
          Logo
        </a>
      </div>
      
      {/* Links Section */}
      <div className="hidden sm:flex w-[40%] justify-center">
        <div className="flex flex-row gap-14 w-full text-white/85 justify-center">
          <a className="hover:text-white" href="#home">Home</a>
          <a className="hover:text-white" href="#about">About</a>
          <a className="hover:text-white" href="#community">Community</a>
        </div>
      </div>

      {/* Button Section */}
      <div className="flex justify-end w-[30%]">
        <button className="px-8 py-2 border border-black bg-transparent text-black dark:border-white relative group transition duration-200">
          <div className="absolute -bottom-2 -right-2 bg-gray-400 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
          <span className="relative">
            LEAVE A NOTE
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
