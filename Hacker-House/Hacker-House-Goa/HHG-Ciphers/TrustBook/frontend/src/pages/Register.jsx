import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" text-white bg-[#14162E] min-h-screen px-8">
        {/* */}
        <div className="  relative flex flex-col pt-24 justify-end">
          <div className="aspect-square absolute opacity-65 left-[36rem] top-24 blur-[100px]  rounded-full w-56 bg-[#DDA82A]"></div>
          <div className="aspect-square absolute opacity-65 left-[45rem] top-80 blur-[100px]  rounded-full w-56 bg-[#4461F2]"></div>
          <h1 className="text-7xl text-center font-2 font-bold font-sans">
            CONTINUE AS
          </h1>
          <div className="flex justify-between items-center h-[75vh] px-14 ">
            {/* TODO: Add registration logic */}
            {/* Org Login */}
            <div
              onClick={() => navigate("/register/org")}
              className=" cursor-pointer hover:scale-110 duration-100 text-4xl aspect-video border-2 border-[rgba(255, 255, 255, 0.80)] rounded-3xl flex justify-center items-center h-[35vh] w-[22vw] bg-[linear-gradient(109deg,rgba(201,201,201,0.24)_1.57%,rgba(196,196,196,0.03)_100%)] font-2 font-sans"
            >
              ORGANIZATION
            </div>
            <img
              className="self-end animated-element aspect-auto h-[65vh]"
              src="./Character-yoga.png"
            />
            {/* User Login */}
            <div
              onClick={() => navigate("/register/user")}
              className=" cursor-pointer hover:scale-110 duration-100 text-4xl aspect-video border-2 border-[rgba(255, 255, 255, 0.80)] rounded-3xl flex justify-center items-center h-[35vh] w-[22vw] bg-[linear-gradient(109deg,rgba(201,201,201,0.24)_1.57%,rgba(196,196,196,0.03)_100%)] font-2 font-sans"
            >
              ENJOYER
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
