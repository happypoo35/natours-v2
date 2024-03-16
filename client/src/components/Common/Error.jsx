import { Link } from "react-router-dom";

const Error = () => {
  return (
    <main className="main-error pad">
      <div className="container">
        <span className="error-code">404</span>
        <Link to="/" className="btn primary">
          Return to main page
        </Link>
      </div>
    </main>
  );
};

export default Error;
