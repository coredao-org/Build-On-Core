
import logo from "../assets/logo.svg"
import { FaGithub } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-8">
        <section className="flex justify-between flex-col lg:flex-row md:flex-row w-[85%] mx-auto py-4">
        <div className="my-4 w-[100%] lg:w-[32%] md:w-[32%]">
        <div className="flex items-center mb-4">
        <img src={logo} alt="" className="w-[30px] h-[30px]"/>
        <p className="lg:text-[20px] md:text-[20px] text-[18px] font-[600]">PeerLend</p>
        </div>
        <p className="my-4 text-[14px] tracking-10">Empowering financial freedom through secure and seamless peer-to-peer lending.</p> 
        <div>
            <p>Follow Us:</p>
            <div className="flex text-[#E0BB83] mt-2 items-center">
            <FaGithub className="mr-4 text-[28px]" />
            <RiTwitterXFill className="mr-4 text-[28px]" /> 
            <SiDiscord className="text-[28px] mr-4"/>
            <FaLinkedin className="text-[28px]" />
            </div>
        </div>
        </div>
        <div className="my-4 w-[100%] lg:w-[32%] md:w-[32%] mx-auto">
            <h3 className="lg:text-[20px] md:text-[20px] text-[18px] mb-4 font-[600] text-[#E0BB83]">Pages</h3>
            <div className="flex lg:items-center md:items-center lg:flex-row md:flex-row flex-col">
            <NavLink className="flex items-center mb-2">Home <p className="lg:h-[10px] md:h-[10px] h-0 w-[10px] rounded-full bg-[#E0BB83] mx-4"></p></NavLink>
            <NavLink className="flex items-center mb-2">About Us <p className="lg:h-[10px] md:h-[10px] h-0 w-[10px] rounded-full bg-[#E0BB83] mx-4"></p></NavLink>
            <NavLink className="flex items-center mb-2">Contact Us <p className="lg:h-[10px] md:h-[10px] h-0 w-[10px] rounded-full bg-[#E0BB83] mx-4"></p></NavLink>
            <NavLink className='mb-2'>Blog</NavLink>
            </div>
        </div>
        <div className="my-4 w-[100%] lg:w-[32%] md:w-[32%]">
            <h3 className="lg:text-[20px] md:text-[20px] text-[18px] mb-4 font-[600] text-[#E0BB83]">Contact</h3>
            <p className="flex items-center"><MdEmail className="text-[#E0BB83] mr-2"/> peerlend_int@gmail.com</p>
            <p className="mt-4 text-[#E0BB83] font-[600] text-[18px]">Subscribe to our Newsletter</p>
            <p className="text-[14px]">Get exclusive news and updates.</p>
            <div className="border border-[#E0BB83] rounded-md flex justify-between p-2 my-4">
              <input type="text" placeholder="Email Address" className="outline-none bg-transparent"/>
              <button className="bg-[#E0BB83] p-2 rounded-md"><IoIosSend className="text-[#2a2a2a] text-2xl"/></button>
            </div>
        </div>
        </section>
        <section className="border-t border-[#E0BB83] text-center p-4">
            <p>&copy; All Rights reserved PeerLend Team.</p>           
        </section>
    </footer>
  )
}

export default Footer