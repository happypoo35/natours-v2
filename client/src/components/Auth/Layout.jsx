import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="main-auth pad">
      <div className="container">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
