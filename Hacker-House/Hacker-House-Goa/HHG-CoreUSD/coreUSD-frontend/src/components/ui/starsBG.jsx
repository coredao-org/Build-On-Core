/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";
import { cn } from "../../lib/utils";

export const Star = ({ x, y, radius, opacity, twinkleSpeed }) => (
  <circle cx={x} cy={y} r={radius} fill="white" opacity={opacity}>
    {twinkleSpeed !== null && (
      <animate
        attributeName="opacity"
        values={`${opacity};${opacity * 0.3};${opacity}`}
        dur={`${twinkleSpeed}s`}
        repeatCount="indefinite"
      />
    )}
  </circle>
);

export const StarsBackground = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
}) => {
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  const generateStars = useCallback(
    (width, height) => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
    ]
  );

  useEffect(() => {
    const updateStars = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setStars(generateStars(width, height));
      }
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("h-screen w-screen absolute inset-0", className)}
    >
      <svg
        preserveAspectRatio="none"
        className="h-screen w-full bg-transparent"
      >
        <rect width="100%" height="100%" fill="none" />
        {stars.map((star, index) => (
          <Star key={index} {...star} />
        ))}
      </svg>
    </div>
  );
};
