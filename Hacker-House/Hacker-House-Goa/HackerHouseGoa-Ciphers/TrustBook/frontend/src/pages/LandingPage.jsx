import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  
  const navigate = useNavigate()
  const features = {
    users: [
      {
        title: "Verified Profiles",
        description:
          "Secure your identity with Aadhaar verification, ensuring a trustworthy community.",
      },
      {
        title: "MetaMask Integration",
        description:
          "Login securely using your MetaMask wallet for enhanced protection.",
      },
      {
        title: "Genuine Connections",
        description:
          "Connect with real individuals, fostering authentic relationships and discussions.",
      },
      {
        title: "Spam-Free Environment",
        description:
          "Enjoy conversations free from spam and fake accounts, thanks to our verification process.",
      },
    ],
    organizations: [
      {
        title: "Business Verification",
        description:
          "Establish credibility with GST-verified business accounts, building trust with your audience.",
      },
      {
        title: "Secure MetaMask Login",
        description:
          "Access your organization's account securely using MetaMask integration.",
      },
      {
        title: "Authentic Audience Engagement",
        description:
          "Interact with a verified user base, ensuring meaningful connections and feedback.",
      },
      {
        title: "Verified Business Presence",
        description:
          "Stand out with a verified badge, showcasing your organization's legitimacy on the platform.",
      },
    ],
  };

  return (
    <div className="w-screen min-h-screen text-white bg-[#14162E] overflow-x-hidden">
      <div className="flex flex-col relative min-h-[100vh] justify-between px-4 md:px-14">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-around items-center flex-grow py-10">
          <div className="flex flex-col items-center justify-around w-full md:w-[40vw] z-10 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-7xl text-center opacity-95 tracking-normal font-sans font-bold mb-6">
              Trust at your Fingertips
            </h1>
            <p className="text-xl text-center mb-8">
              A 100% legitimate social platform for verified users and
              organizations
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => {navigate("/register/user")}} className="bg-white duration-200 rounded-lg hover:scale-105 text-black p-3 text-xl">
                Sign Up as User
              </button>
              <button onClick={() => (navigate("/register/org"))} className="bg-[#4461F2] duration-200 rounded-lg hover:scale-105 text-white p-3 text-xl">
                Register Organization
              </button>
            </div>
          </div>
          <div className="animate-pulse">
            <img
              src="./Aadhar-image.png"
              alt="Aadhar Verification"
              className="h-auto"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20 z-10">
          <h2 className="text-4xl font-bold text-center mb-8">Key Features</h2>
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 rounded-l-lg ${
                activeTab === "users" ? "bg-[#4461F2]" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("users")}
            >
              For Users
            </button>
            <button
              className={`px-6 py-2 rounded-r-lg ${
                activeTab === "organizations" ? "bg-[#4461F2]" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("organizations")}
            >
              For Organizations
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features[activeTab].map((feature, index) => (
              <div key={index} className="bg-[#1A1C38] p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="aspect-square absolute opacity-65 left-32 top-24 blur-[100px] rounded-full w-56 bg-[#DDA82A]"></div>
        <div className="aspect-square absolute opacity-65 left-72 top-80 blur-[100px] rounded-full w-56 bg-[#4461F2]"></div>
      </div>
    </div>
  );
};

export default LandingPage;
