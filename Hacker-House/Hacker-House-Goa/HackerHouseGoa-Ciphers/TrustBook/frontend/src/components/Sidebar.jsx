import { useNavigate } from "react-router-dom";
import { MdOutlinePostAdd } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { PiSwap } from "react-icons/pi";

const Sidebar = () => {
  const options = [
    {
      title: "Home",
      icon: <MdOutlinePostAdd className="text-2xl" />,
      url: "/home",
    },
    {
      title: "MarketPlace",
      icon: <FiShoppingBag className="text-2xl" />,
      url: "/marketplace",
    },
    {
      title: "Messages",
      icon: <BiMessageSquareDetail className="text-2xl" />,
      url: "/messages",
    },
    {
      title: "Swapper",
      icon: <PiSwap className="text-2xl" />,
      url: "/swapper",
    },
  ];

  const navigate = useNavigate();
  return (
    <>
      <div className="flex bg-[#14162E] flex-col h-screen fixed border-x-2 border-l-0  w-[15vw] text-white justify-start gap-10 py-14 items-start px-14">
        <div>
          <h1 className="font-bold text-2xl gap-2 flex items-center">
            <img className="aspect-auto w-[2vw]" src="/logo.png" />
            TrustBook
          </h1>
        </div>
        {options.map((opt) => {
          return (
            <div className="flex items-center gap-2 text-xl hover:scale-110 cursor-pointer duration-75">
              {opt.icon}
              <h1 onClick={() => navigate(opt.url)} className="">
                {opt.title}
              </h1>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
