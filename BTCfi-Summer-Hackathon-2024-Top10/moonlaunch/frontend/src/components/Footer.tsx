const Footer = () => {
  return (
    <div className="w-full px-5 mt-16 flex-col flex justify-center items-center bg-[#191A1A]   ">
      <div className="flex max-w-[1100px] justify-center items-center mb-5 ">
        <img src="../images/Core 2.png" alt="" />
      </div>
      <div className="max-w-[1100px] w-full flex justify-between items-end md:items-center gap-10 text-xs text-white uppercase border-t border-[#ffffff61] py-5">
        <div className="md:w-full md:flex-row flex-col flex justify-between md:items-center gap-3 text-xs text-white uppercase">
          <p className="text-[#ffffff84]"> copyright 2024 </p>
          <p> Terms and conditions</p>
          <p>Privacy Policy</p>
          <p>Whitepaper</p>
          <p>Visit moonlaunch</p>
        </div>

        <div className="flex gap-2 items-center">
          <img src="./images/medium.png" alt="" />
          <img src="./images/twitter.png" alt="" />
          <img src="./images/telegram.png" alt="" />
          <img src="./images/discord.png" alt="" />
          <img src="./images/linkdin.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
