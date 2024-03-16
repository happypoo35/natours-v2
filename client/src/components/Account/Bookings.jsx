import { FiCalendar, FiFrown } from "react-icons/fi";
import { useLocale } from "hooks";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserBookings } from "features/user.slice";
import { usePrefetch } from "app/api";

const Bookings = () => {
  const navigate = useNavigate();
  const localeDate = useLocale();

  const prefetchTour = usePrefetch("singleTour");
  const bookings = useSelector(selectUserBookings);

  const handleDate = (startDate, duration) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return date;
  };

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">your bookings</h2>
      {bookings.length ? (
        <div className="account-content-list bookings">
          {bookings?.map((el) => (
            <article
              key={el._id}
              className="list-item"
              onClick={() => navigate(`/tours/${el.tour.slug}`)}
              onMouseEnter={() => prefetchTour(el.tour.slug)}
            >
              <div className="img">
                <img src={el.tour.imageCover} alt="tour" />
              </div>
              <span className="name">{el.tour.name}</span>
              <span className="date">
                <FiCalendar />
                {`${localeDate(el.tour.startDates[0])} — ${localeDate(
                  handleDate(el.tour.startDates[0], el.tour.duration)
                )}`}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-content-empty">
          <FiFrown />
          <span>You don't have any bookings yet</span>
        </div>
      )}
    </section>
  );
};

export default Bookings;
