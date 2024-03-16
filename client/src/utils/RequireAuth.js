import { Navigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "features/user.slice";

const RequireAuth = ({ children }) => {
  const { pathname } = useLocation();
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" state={{ from: pathname }} />;
  }

  return children;
};

export default RequireAuth;
