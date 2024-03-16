import { ReactComponent as Logo } from "assets/logo.svg";
import { Link } from "react-router-dom";

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

const Footer = () => {
  return (
    <footer className="footer pad">
      <Link to="/">
        <Logo className="logo" />
      </Link>
      <nav className="footer-nav">
        {navData.map((el, id) => (
          <Link key={id} className="nav-link" to={el.slug}>
            {el.name}
          </Link>
        ))}
      </nav>
      <span className="copy">&copy; 2022 Natours</span>
    </footer>
  );
};

export default Footer;
