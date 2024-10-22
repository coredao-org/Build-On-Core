import React, { useRef } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Info from "./Info";
import Patners from "./Patners";
import Join from "./Join";
import Footer from "./Footer";

const Layout = () => {
  const infoRef = useRef(null);
  const partnerRef = useRef(null);

  const handleScrollToPartner = () => {
    if (partnerRef.current) {
      partnerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToInfo = () => {
    if (infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar
        onScrollToInfo={handleScrollToInfo}
        onScrollToPartner={handleScrollToPartner}
      />
      <Hero />
      <div ref={infoRef}>
        <Info />
      </div>
      <div ref={partnerRef}>
        <Patners />
      </div>
      <Join />
      <Footer />
    </div>
  );
};

export default Layout;
