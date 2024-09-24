import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const Reveal = ({ children, width = "fit-content" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    console.log(isInView);
    // fire the animation
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    } else {
      mainControls.start("hidden");
      slideControls.start("hidden");
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        overflow: isInView ? "visible" : "hidden",
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75, overflow: "hidden" },
          visible: { opacity: 1, y: 0, overflow: "visible" },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          left: 0,
          bottom: 4,
          right: 0,
          background: "white",
          zIndex: 20,
        }}
      />
    </div>
  );
};

export default Reveal;
