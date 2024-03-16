import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const Layout = () => {
  return (
    <main className="main-account pad">
      <section className="account card container">
        <Nav />
        <div className="account-content">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default Layout;
