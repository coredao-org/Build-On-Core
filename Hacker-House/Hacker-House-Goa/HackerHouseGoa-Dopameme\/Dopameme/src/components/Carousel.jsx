import React, { useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";

const images = [
  "https://i.imgur.com/SUSkULw.jpeg",
  "https://i.imgur.com/VuTf6bE.jpeg",
  "https://i.imgur.com/VRfVVsa.jpeg",
  "https://i.imgur.com/y3IsIT2.jpeg",
  "https://i.imgur.com/iQmXABr.jpeg",
  "https://i.imgur.com/6goX8x3.jpeg",
];

const DopamemeCarousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let animationId;

    const animate = () => {
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += 1;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={carouselRef}
      className="flex gap-4 overflow-x-hidden w-full"
      style={{ scrollBehavior: "smooth" }}
    >
      {[...images, ...images].map((image, idx) => (
        <img
          key={idx}
          src={image}
          alt={`Slide ${idx + 1}`}
          className="w-[400[]] rounded-xl h-[456px] overflow-x-hidden object-fill flex-shrink-0"
        />
      ))}
    </div>
  );
};

export default DopamemeCarousel;
