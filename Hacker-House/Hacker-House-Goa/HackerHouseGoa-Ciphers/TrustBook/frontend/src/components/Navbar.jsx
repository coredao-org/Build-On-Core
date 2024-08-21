import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex fixed w-screen  z-40 text-white justify-between bg-transparent items-center font-semibold p-9">
        <div>
          <h1 className="font-bold text-2xl gap-3 flex items-center">
            <span>
              {" "}
              <img className="aspect-auto w-[4vw]" src="/logo.png" />
            </span>
            TrustBook
          </h1>
        </div>
        <div className="flex gap-7 justify-evenly">
          <button
            className=""
            onClick={() => {
              navigate("/signin");
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="rounded-[21px] bg-white p-2 px-5 text-[#4461F2]"
          >
            Register
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
