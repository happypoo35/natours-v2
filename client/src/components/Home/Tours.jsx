import { Link } from "react-router-dom";
import TourCard from "./TourCard";

import { useHighestRatedQuery } from "app/tours.api";

const Tours = () => {
  const { data: tours } = useHighestRatedQuery();

  return (
    <section className="tours pad" id="top-tours">
      <div className="container">
        <h2 className="h2">Most popular tours</h2>
        <p className="body">
          Duis hendrerit tempor tortor non scelerisque. Fusce mi est, elementum
          vitae fermentum id, commodo eget justo. Cras congue felis orci.
        </p>
        <section className="tours-list">
          {tours?.map((el) => (
            <TourCard key={el.id} tour={el} />
          ))}
        </section>
        <Link to="/tours" className="btn primary upper big">
          discover all tours
        </Link>
      </div>
    </section>
  );
};

export default Tours;
