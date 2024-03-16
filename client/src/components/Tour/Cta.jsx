import { ReactComponent as LogoMark } from "assets/logo-mark.svg";
import { Link, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "features/user.slice";
import { useCheckoutMutation } from "app/bookings.api";

const Cta = ({ duration, images, tourId }) => {
  const { pathname } = useLocation();

  const user = useSelector(selectUser);
  const [checkout, { isLoading, isSuccess }] = useCheckoutMutation();

  const handleCheckout = async () => {
    try {
      const res = await checkout(tourId).unwrap();
      window.location = res.url;
    } catch (err) {}
  };

  return (
    <section className="cta pad" id="checkout">
      <div className="container">
        <article className="cta-card">
          <div className="images">
            {images.map((el, id) => {
              if (id === 0)
                return (
                  <div key={id} className="images-item logo">
                    <LogoMark />
                  </div>
                );
              return (
                <img key={id} className="images-item" src={el} alt="tour" />
              );
            })}
          </div>
          <div className="text">
            <h3 className="h4 accent">what are you waiting for?</h3>
            <p>
              {duration} days. 1 adventure. Infinite memories. Make it yours
              today!
            </p>
          </div>
          {user ? (
            <button onClick={handleCheckout} className="btn primary upper">
              {isLoading ? (
                <div className="processing">
                  <div className="spinner" id="spinner"></div>
                  Processing
                </div>
              ) : isSuccess ? (
                "success"
              ) : (
                "book tour now!"
              )}
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: pathname }}
              className="btn primary upper"
            >
              log in to book tour
            </Link>
          )}
        </article>
      </div>
    </section>
  );
};

export default Cta;
