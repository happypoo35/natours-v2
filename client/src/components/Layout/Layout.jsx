import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

import { useSelector } from "react-redux";
import { selectShowMenu, selectShowSideMenu } from "features/global.slice";

const Layout = () => {
  const isShowMenu = useSelector(selectShowMenu);
  const isShowSideMenu = useSelector(selectShowSideMenu);

  return (
    <div
      className={`wrapper ${
        isShowMenu || isShowSideMenu ? "wrapper-modal" : ""
      } ${isShowSideMenu ? "tinted" : ""}`}
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
