import { FiClock, FiMapPin } from "react-icons/fi";

const Hero = ({ tour }) => {
  return (
    <section className="hero pad">
      <img src={tour.imageCover} alt="tour-cover" className="bg-img" />
      <h1 className="h2">{tour.name} tour</h1>
      <div className="hero-info">
        <span className="h4 hero-info-item">
          <FiClock /> {tour.duration} days
        </span>
        <span className="h4 hero-info-item">
          <FiMapPin />
          {tour.startLocation.description}
        </span>
      </div>
    </section>
  );
};

export default Hero;
