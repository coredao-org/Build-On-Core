import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [aadharVerified, setAadharVerified] = useState(false);
  const [AnonAadhaar] = useAnonAadhaar();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGstSubmit = (e) => {
    if (username.trim().length === 0) {
      console.log("Can't be empty");
      return;
    }
    console.log("got number");
  };

  const handleMetamaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setConnected(true);
          console.log("Connected to MetaMask:", accounts[0]);

          // Login the user
          const userData = {
            address: accounts[0],
            username: username,
          };
          login(userData);

          // Redirect to an authenticated route (e.g., marketplace)
          navigate("/home");
        }
      } catch (error) {
        console.error("Failed to connect to MetaMask", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  useEffect(() => {
    console.log("Country Identity status: ", AnonAadhaar.status);
    if (AnonAadhaar.status === "logged-in") setAadharVerified(true);
  }, [AnonAadhaar]);

  return (
    <>
      <div className="w-screen min-h-screen text-white bg-[#14162E]">
        <div className="flex relative min-h-[80vh] justify-between px-24 items-center">
          <div className="max-w-[30vw] overflow-hidden">
            <h1 className="text-6xl text-center font-bold">
              GET STARTED WITH THE AWESOMENESS
            </h1>
          </div>
          <img
            className="aspect-auto h-[67vh] self-end animated-element"
            src="/Character-standing.png"
          />
          <div className="flex flex-col gap-3 flex-wrap">
            <h1 className="text-center text-3xl">User Registration</h1>
            {!connected ? (
              <>
                {!aadharVerified ? (
                  <>
                    <div className="bg-[#4461F2] p-4 rounded-xl flex justify-between hover:bg-[#253896] cursor-pointer">
                      Upload Your Aadhar Below <img src="/aadhar.png" />
                    </div>
                    <div className="flex justify-center">
                      <LogInWithAnonAadhaar nullifierSeed={1234} />
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white text-black"
                    />

                    <Button
                      onClick={handleMetamaskConnection}
                      className="bg-[#4461F2] hover:bg-[#253896]"
                    >
                      Connect MetaMask
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="bg-[#4461F2] p-4 rounded-xl text-center">
                  Connected Successfully!
                </div>
              </>
            )}
          </div>
          <div className="aspect-square absolute opacity-65 left-32 top-24 blur-[100px] rounded-full w-56 bg-[#DDA82A]"></div>
          <div className="aspect-square absolute opacity-65 left-72 top-80 blur-[100px] rounded-full w-56 bg-[#4461F2]"></div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
