const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="bg-[#191a1a]  mt-7 w-full flex flex-col gap-10 items-center ">
      <img src="../images/Core 2.png" alt="" />
      <h1>{text}</h1>
    </div>
  );
};

export default EmptyState;
