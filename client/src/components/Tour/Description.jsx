import { FiCalendar, FiTrendingUp, FiUsers, FiStar } from "react-icons/fi";

const data = (tour) => [
  {
    name: "next date",
    icon: <FiCalendar />,
    value: new Date(tour.startDates[0]).toLocaleString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  },
  {
    name: "difficulty",
    icon: <FiTrendingUp />,
    value: tour.difficulty,
  },
  {
    name: "participants",
    icon: <FiUsers />,
    value: `${tour.maxGroupSize} people`,
  },
  {
    name: "rating",
    icon: <FiStar />,
    value: tour.ratingsAverage,
  },
];

const Description = ({ tour }) => {
  const factsData = data(tour);

  return (
    <section className="description">
      <div className="container">
        <div className="overview pad">
          <div className="overview-group">
            <h2 className="h4 accent">quick facts</h2>
            <div className="overview-group-list">
              {factsData.map((el, id) => (
                <div key={id} className="overview-group-list-item">
                  <span className="name h5">
                    {el.icon}
                    {el.name}
                  </span>
                  <span className="value">{el.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overview-group">
            <h2 className="h4 accent">your tour guides</h2>
            <div className="overview-group-list">
              {tour.guides.map((el) => (
                <div key={el._id} className="overview-group-list-item">
                  <span className="name h5">
                    <img src={el.photo} alt="guide" />
                    {el.role}
                  </span>
                  <span className="value">{el.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text pad">
          <h2 className="h4 accent">about {tour.name} tour</h2>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
            <br />
            <br /> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Description;
