import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const desktop = windowSize > 1024;
  const tablet = windowSize <= 768;
  const mobile = windowSize <= 576;

  return { desktop, tablet, mobile, isTouch };
};

export default useWindowSize;
