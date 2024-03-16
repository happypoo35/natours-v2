import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollOnPathnameChange = ({ pathname }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ScrollOnMount = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

const ScrollToTop = ({ exceptions }) => {
  const { pathname } = useLocation();
  const isException = exceptions.some((el) => pathname.match(el));

  if (isException) return <ScrollOnMount />;

  return <ScrollOnPathnameChange pathname={pathname} />;
};

export default ScrollToTop;
