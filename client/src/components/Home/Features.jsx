import nat4 from "assets/nat-4.jpg";
import { FiGlobe, FiMap, FiCompass, FiHeart } from "react-icons/fi";

const featuresData = [
  {
    icon: <FiGlobe />,
    name: "Explore the world",
    text: "In non pulvinar orci, sed porta lorem. Morbi ut mauris quis sapien",
  },
  {
    icon: <FiCompass />,
    name: "Meet nature",
    text: "Aenean pulvinar, risus nec tincidunt congue, enim nisi venenatis ante, at efficitur",
  },
  {
    icon: <FiMap />,
    name: "Find your way",
    text: "Morbi quis faucibus elit, et elementum metus. Pellen pulvinar augue eu diam",
  },
  {
    icon: <FiHeart />,
    name: "Live a healthier life",
    text: "Cras vitae est vel leo varius facilisis. Aliquam fringilla, nunc non sagittis",
  },
];

const Features = () => {
  return (
    <section className="features pad" aria-label="Our features">
      <img src={nat4} className="bg-img" alt="features img" />
      <div className="container">
        <div className="features-cards">
          {featuresData.map((el, id) => (
            <article
              key={id}
              aria-label={el.name}
              className="features-cards-item"
            >
              {el.icon}
              <h3 className="h4">{el.name}</h3>
              <p>{el.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
