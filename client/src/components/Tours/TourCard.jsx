import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiFlag, FiUser } from "react-icons/fi";

import { usePrefetch } from "app/api";

const data = (tour) => [
  {
    icon: <FiMapPin />,
    text: tour.startLocation.description,
  },
  {
    icon: <FiCalendar />,
    text: new Date(tour.startDates[0]).toLocaleString("en-EN", {
      year: "numeric",
      month: "long",
    }),
  },
  {
    icon: <FiFlag />,
    text: `${tour.locations.length} stops`,
  },
  {
    icon: <FiUser />,
    text: `${tour.maxGroupSize} people`,
  },
];

const TourCard = ({ tour }) => {
  const cardData = data(tour);
  const prefetchTour = usePrefetch("singleTour");

  const handlePrefetch = () => {
    prefetchTour(tour.slug);
  };

  return (
    <article className="card" aria-label={tour.name}>
      <header className="card-header">
        <div className="card-img">
          <img src={tour.imageCover} alt={tour.name} />
        </div>
        <h3 className="h3">
          <span>{tour.name}</span>
        </h3>
      </header>
      <div className="card-body">
        <h4 className="h4">
          {tour.duration}-day tour
          <span className="card-badge">{tour.difficulty}</span>
        </h4>
        <p className="card-text">{tour.summary}</p>
        <div className="card-body-data">
          {cardData.map((el, id) => (
            <div className="card-body-data-item" key={id}>
              {el.icon}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <div className="card-footer-data">
          <span className="card-footer-data-item">
            <b>${tour.price}</b> per person
          </span>
          <span className="card-footer-data-item">
            <b>{tour.ratingsAverage}</b> rating({tour.ratingsQuantity})
          </span>
        </div>
        <Link
          to={`/tours/${tour.slug}`}
          onMouseEnter={handlePrefetch}
          className="btn primary upper-small"
        >
          details
        </Link>
      </div>
    </article>
  );
};

export default TourCard;
