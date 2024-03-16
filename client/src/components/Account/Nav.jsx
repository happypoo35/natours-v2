import * as fi from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

import { useLogoutMutation } from "app/auth.api";
import { selectRole } from "features/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { selectShowSideMenu, setShowSideMenu } from "features/global.slice";
import { useEffect, useRef } from "react";
import { useWindowSize } from "hooks";

const menuItems = [
  {
    name: "settings",
    icon: <fi.FiSettings />,
    slug: ".",
  },
  {
    name: "my bookings",
    icon: <fi.FiBriefcase />,
    slug: "./bookings",
  },
  {
    name: "my reviews",
    icon: <fi.FiStar />,
    slug: "./reviews",
  },
  {
    name: "billing",
    icon: <fi.FiCreditCard />,
    slug: "./billing",
  },
];

const adminItems = [
  {
    name: "manage tours",
    icon: <fi.FiMap />,
    slug: "./manage-tours",
  },
  {
    name: "manage users",
    icon: <fi.FiUsers />,
    slug: "./manage-users",
  },
  {
    name: "manage reviews",
    icon: <fi.FiStar />,
    slug: "./manage-reviews",
  },
  {
    name: "manage bookings",
    icon: <fi.FiBriefcase />,
    slug: "./manage-bookings",
  },
];

const Nav = () => {
  const navRef = useRef(null);
  const { key, state } = useLocation();
  const { tablet } = useWindowSize();

  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const isShowSideMenu = useSelector(selectShowSideMenu);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!isShowSideMenu) return;

    const closeSideMenu = (e) => {
      if (!navRef.current.contains(e.target)) {
        dispatch(setShowSideMenu(false));
      }
    };

    document.addEventListener("mousedown", closeSideMenu);
    return () => document.removeEventListener("mousedown", closeSideMenu);
  });

  useEffect(() => {
    if (state === "showMenu") return;
    dispatch(setShowSideMenu(false));
  }, [dispatch, key, state]);

  useEffect(() => {
    if (isShowSideMenu && !tablet) {
      dispatch(setShowSideMenu(false));
    }
  }, [dispatch, tablet, isShowSideMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setShowSideMenu(false));
    } catch (err) {}
  };

  return (
    <nav
      className={`account-nav ${isShowSideMenu ? "active" : ""}`}
      ref={navRef}
    >
      {tablet && (
        <fi.FiX
          className="btn-close"
          onClick={() => dispatch(setShowSideMenu(false))}
        />
      )}
      <div className="account-nav-user">
        <div className="nav-list">
          {menuItems.map((el, id) => (
            <NavLink key={id} to={el.slug} end className="account-nav-link">
              {el.icon} {el.name}
            </NavLink>
          ))}
        </div>
      </div>
      {role === "admin" && (
        <div className="account-nav-admin">
          <h5 className="h5">admin</h5>
          <div className="nav-list">
            {adminItems.map((el, id) => (
              <NavLink key={id} to={el.slug} className="account-nav-link">
                {el.icon} {el.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <div className="account-nav-link" onClick={handleLogout}>
        <fi.FiLogOut /> Log out
      </div>
    </nav>
  );
};

export default Nav;
