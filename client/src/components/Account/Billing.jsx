import { FiFrown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocale } from "hooks";

import { useSelector } from "react-redux";
import { selectUserBookings } from "features/user.slice";

const Billing = () => {
  const navigate = useNavigate();
  const bookings = useSelector(selectUserBookings);
  const localeDate = useLocale();

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">billing</h2>
      {bookings.length ? (
        <div className="grid-table col4 billing">
          <div className="grid-table-header">
            <span>Tour name</span>
            <span>Order date</span>
            <span>Price</span>
            <span>Status</span>
          </div>
          {bookings?.map((el) => (
            <article
              key={el._id}
              className="grid-table-item"
              onClick={() => navigate(`/tours/${el.tour.slug}`)}
            >
              <b className="name">
                <img src={el.tour.imageCover} alt="tour" />
                {el.tour.name}
              </b>
              <span>{localeDate(el.createdAt)}</span>
              <b>${el.price}</b>
              <span className={`status ${el.paid ? "" : "fail"}`}>
                {el.paid ? "paid" : "fail"}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-content-empty">
          <FiFrown />
          <span>Your billing is empty</span>
        </div>
      )}
    </section>
  );
};

export default Billing;
