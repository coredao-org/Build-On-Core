import { useEffect } from "react";

function AutoScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    const element = document.querySelector(hash);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}

export default AutoScroll;
