import { Button } from "@/components/ui/button";

const UserSignin = () => {
    const handleMetmaskConnection = () => {
        
    }
  return (
    <>
      <div className="w-screen min-h-screen text-white bg-[#14162E]">
        {/* */}
        <div className="flex relative w-full min-h-[80vh] justify-between px-20 items-center ">
          {/* Circles */}
          <div className="flex w-[32vw] z-10 ">
            <h1 className="text-6xl text-center  opacity-95 tracking-normal font-sans font-bold">
              SIGN IN TO AWESOMENESS
            </h1>
          </div>
          <img
            className="animated-element  aspect-auto "
            src="/Character-falling.png"
          />
          <div className="flex flex-col gap-7 min-w-[30vw] items-center justify-center">
            <h1 className="text-3xl text-center">User Login</h1>
            <Button
              onClick={handleMetmaskConnection}
              className=" bg-[#4461F2] w-[22vw] hover:bg-[#253896] "
            >
              Connect to Metamask{" "}
              <img className="ml-2" src="/metamask-icon.png" />
            </Button>
          </div>
          <div className="aspect-square absolute opacity-65 left-32 top-24 blur-[100px]  rounded-full w-56 bg-[#DDA82A]"></div>
          <div className="aspect-square absolute opacity-65 left-72 top-80 blur-[100px]  rounded-full w-56 bg-[#4461F2]"></div>
        </div>
      </div>
    </>
  );
};
export default UserSignin;
