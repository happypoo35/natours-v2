import { Link } from "react-router-dom";
import { FiMap, FiFlag, FiUsers, FiClock, FiTrendingUp } from "react-icons/fi";
import { useWindowSize } from "hooks";

import { usePrefetch } from "app/api";

const data = (tour) => [
  {
    icon: <FiClock />,
    text: `${tour.duration}-day tour`,
  },
  {
    icon: <FiUsers />,
    text: `Up to ${tour.maxGroupSize} people`,
  },
  {
    icon: <FiMap />,
    text: `${tour.guides.length} tour guides`,
  },
  {
    icon: <FiFlag />,
    text: `${tour.locations.length} stops`,
  },
  {
    icon: <FiTrendingUp />,
    text: tour.difficulty.replace(/^./, tour.difficulty[0].toUpperCase()),
  },
];

const TourCard = ({ tour }) => {
  const { tablet, isTouch } = useWindowSize();

  const cardData = data(tour);
  const prefetchTour = usePrefetch("singleTour");

  const handlePrefetch = () => {
    prefetchTour(tour.slug);
  };

  return (
    <article className="card" aria-label={tour.name}>
      <div className="card-face card-face-front">
        <header className="card-header">
          <div className="card-img">
            <img src={tour.imageCover} alt={tour.name} />
          </div>
          <h3 className="h3">
            <span>{tour.name}</span>
          </h3>
        </header>
        <div className="card-body">
          <div className="card-body-data">
            {cardData.map((el, id) => (
              <div className="card-body-data-item" key={id}>
                {el.icon}
                <span>{el.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-face card-face-back">
        <div className="card-body">
          <h4 className="h4">only</h4>
          <span>${tour.price}</span>
          <Link
            to={`/tours/${tour.slug}`}
            className={
              tablet || isTouch
                ? "btn outline upper-small"
                : "btn white upper big"
            }
            onMouseEnter={handlePrefetch}
          >
            book now!
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
