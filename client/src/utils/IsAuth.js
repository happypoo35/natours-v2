import { Navigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "features/user.slice";

const IsAuth = ({ children }) => {
  const { state } = useLocation();
  const user = useSelector(selectUser);
  const from = state?.from || "/account";

  if (user) {
    return <Navigate to={from} replace />;
  }

  return children;
};

export default IsAuth;
