import { useEffect } from "react";
import { ReactComponent as Logo } from "assets/logo-gradient.svg";
import { ReactComponent as LogoMark } from "assets/logo-mark.svg";
import { FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "hooks";

import { useDispatch, useSelector } from "react-redux";
import { clear, selectUser } from "features/user.slice";
import { useGetUserQuery, useLogoutMutation } from "app/auth.api";
import {
  selectShowMenu,
  setShowMenu,
  setShowSideMenu,
} from "features/global.slice";

const navData = [
  {
    name: "All tours",
    slug: "/tours",
  },
  {
    name: "Stories",
    slug: "/stories",
  },
  {
    name: "Contact",
    slug: "/contact",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname, key } = useLocation();
  const isHome = pathname === "/";
  const { tablet, mobile } = useWindowSize();

  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = useSelector(selectUser);
  const isShowMenu = useSelector(selectShowMenu);

  const isAuth = document.cookie.includes("auth_session");
  const { isLoading, isError, refetch } = useGetUserQuery(undefined, {
    skip: !isAuth,
  });

  useEffect(() => {
    if (isError) {
      return dispatch(clear());
    }
    // refetch();
  }, [refetch, pathname, isAuth, isError, dispatch]);

  useEffect(() => {
    if (isShowMenu && !tablet) {
      dispatch(setShowMenu(false));
    }
  }, [dispatch, tablet, isShowMenu]);

  useEffect(() => {
    dispatch(setShowMenu(false));
  }, [dispatch, key]);

  const handleAccountClick = () => {
    if (tablet) {
      if (!pathname.includes("account")) {
        navigate("/account", { state: "showMenu" });
      }
      dispatch(setShowSideMenu(true));
    } else {
      navigate("/account");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {}
  };

  return (
    <header className={isHome ? "header header-home pad" : "header pad"}>
      <div className="logo">
        <Link className="nav-link" to="/">
          {isHome || mobile ? <LogoMark /> : <Logo />}
        </Link>
      </div>
      <nav className={`header-nav ${isShowMenu ? "active" : ""}`}>
        {tablet && (
          <Link className="nav-link" to="/">
            Home
          </Link>
        )}
        {navData.map((el, id) => (
          <Link key={id} className="nav-link" to={el.slug}>
            {el.name}
          </Link>
        ))}
      </nav>
      <div className={isLoading ? "header-account loading" : "header-account"}>
        {user ? (
          <>
            {!tablet && (
              <span className="nav-link" onClick={handleLogout}>
                Log out
              </span>
            )}
            <div className="nav-link nav-user" onClick={handleAccountClick}>
              <div className="nav-user-img">
                {user.photo ? <img src={user.photo} alt="user" /> : <FiUser />}
              </div>
              {user.name.split(" ")[0]}
            </div>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login" state={{ from: pathname }}>
              Log in
            </Link>
            {!tablet && (
              <Link
                to="/signup"
                state={{ from: pathname }}
                className={`btn small  ${isHome ? "white" : "outline cta"}`}
              >
                Sign up
              </Link>
            )}
          </>
        )}
      </div>
      {tablet && (
        <button
          className={`hamburger ${isShowMenu ? "active" : ""}`}
          onClick={() => dispatch(setShowMenu(!isShowMenu))}
        >
          <div className="hamburger-icon"></div>
        </button>
      )}
    </header>
  );
};

export default Header;
