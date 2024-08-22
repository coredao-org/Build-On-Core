"use client";

import Navbar from "@/components/Navbar/Navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="container mx-auto hero-main h-full">
          <WavyBackground>
            <div className="flex h-full items-center">
              <div className="max-w-3xl mx-auto text-center text-white">
                <h1 className="text-7xl mb-3">Core Launcher</h1>
                <p className="mb-3">
                  Core Launcher simplifies ERC20 token creation on CoreDAO,
                  offering customizable tokens and a DeFi Dashboard with
                  real-time analytics, reducing costs and technical barriers.
                </p>
                <Link href="/createtoken" className="button button-primary">
                  Launch App
                </Link>
              </div>
            </div>
          </WavyBackground>
        </div>
      </div>
    </>
  );
};

export default Home;
