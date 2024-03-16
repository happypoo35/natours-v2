import nat1 from "assets/nat-1.jpg";
import nat2 from "assets/nat-2.jpg";
import nat3 from "assets/nat-3.jpg";

const About = () => {
  return (
    <section className="about pad" aria-label="About us">
      <div className="container">
        <div className="about-text">
          <h2 className="h2">Exciting tours for adventurous people</h2>
          <p className="body">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
            ipsum sapiente aspernatur libero repellat quis consequatur ducimus
            quam nisi exercitationem omnis earum qui.
          </p>
          <button className="btn outline">
            Learn more <span className="icon">→</span>
          </button>
        </div>
        <div className="about-images">
          <img src={nat1} className="photo photo-1" alt="1" />
          <img src={nat2} className="photo photo-2" alt="2" />
          <img src={nat3} className="photo photo-3" alt="3" />
        </div>
      </div>
    </section>
  );
};

export default About;
