import { NavLink, useLocation } from "react-router-dom";

const TabNav = ({ arr }) => {
  const { pathname } = useLocation();

  const id = arr.findIndex((el) => pathname.endsWith(el));
  const active = id === -1 ? 0 : id;
  const size = arr.length;

  return (
    <nav className="tab-nav">
      {arr.map((el, id) => (
        <NavLink
          key={id}
          className="h5 tab-nav-item"
          to={id === 0 ? "" : el}
          end
        >
          {el}
        </NavLink>
      ))}
      <span
        className="tab-nav-selector"
        style={{
          left: `${(active / size) * 100}%`,
          width: `${(1 / size) * 100}%`,
        }}
      />
    </nav>
  );
};

export default TabNav;
