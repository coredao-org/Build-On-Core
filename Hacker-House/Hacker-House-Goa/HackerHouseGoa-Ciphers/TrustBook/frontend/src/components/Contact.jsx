const Contact = ({ src, username }) => {
  return (
    <>
      <div className="flex cursor-pointer hover:bg-[#5847a9] p-5 text-white text-xl items-center gap-3">
        <div className="overflow-hidden w-[2vw] border-2 border-white aspect-square rounded-full">
          <img className="w-[8vw]" src={src} alt="Profile" />
        </div>
        <span>{username}</span>
      </div>
      <hr />
    </>
  );
};

export default Contact;
