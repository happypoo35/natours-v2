import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectRole } from "features/user.slice";

const RestrictTo = () => {
  const role = useSelector(selectRole);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RestrictTo;
