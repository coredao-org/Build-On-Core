

const Notfound = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-full pt-[80px] grid place-items-center bg-[#191A1AF2] ">
      <div className="flex flex-col gap-2 items-center ">
        <img src="../images/loading.png" alt="" />
        <p className="text-lg capitalize ">
          Sorry, We could not find that token
        </p>
      </div>
    </div>
  );
};

export default Notfound;
