import React from "react";

function Communityt() {
  return (
    <div className="w-full h-screen  flex justify-center items-center bg-transparent">

      <div className="h-[60%] w-[80%] mt-[40px]  flex justify-center items-center">
                <div className=" w-[50%] h-full flex flex-col justify-center items-center">
                    <div className="mb-10">Be part of the UNI 3.0</div>
                    <div className="mb-10">Propose and Find Deals – Learn more</div>
                    <div>
                    <button className="px-8 py-2 border border-black bg-transparent text-black dark:border-white relative group transition duration-200">
                        <div className="absolute -bottom-2 -right-2 bg-gray-400 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
                        <span className="relative"> JOIN COMMUNITY </span>
                    </button> 
                    </div>
                </div>
                <div className="bg-green-50 w-[50%] h-full">
                {/* <img
                  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM21xaDJmbmNraXpobmZ3aHY2aTRuZGJqdGF0c3cwNGh5dzQydXowNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26uf7OXQ5E3rWm5Uc/giphy.webp"
                  alt="Funny GIF"
                  className='w-[80%] h-full'
                /> */}
                </div>
            
      </div>
    </div>
  );
}

export default Communityt;
