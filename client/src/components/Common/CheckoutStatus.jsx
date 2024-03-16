import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { FiCheckCircle } from "react-icons/fi";
import { useEffect } from "react";

const CheckoutStatus = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const checkoutStatus = search.get("status");

  useEffect(() => {
    if (checkoutStatus) {
      setTimeout(() => navigate("/account/bookings", { replace: true }), 5000);
    }
  }, [checkoutStatus, navigate]);

  if (checkoutStatus)
    return (
      <main className="checkout-status pad">
        <div className="container">
          <FiCheckCircle className="icon-success" />
          <div className="checkout-status-text">
            <h2 className="h2">Tour has been successfully booked</h2>
            <p>You will be automatically redirected to your bookings page</p>
          </div>
          <Link to="/account/bookings" replace className="btn primary">
            Your bookings
          </Link>
        </div>
      </main>
    );

  return <Navigate to="/" replace />;
};

export default CheckoutStatus;
