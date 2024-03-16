import imgHero from "assets/hero.jpg";
import imgHeroSmall from "assets/hero-small.jpg";

const Hero = () => {
  const handleHashLink = () => {
    const target = document.getElementById("top-tours");
    target.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <section className="hero" aria-label="Welcome to Natours">
      <picture className="hero-img">
        <source srcSet={imgHero} media="(min-width: 1600px)" />
        <img src={imgHeroSmall} className="bg-img" alt="hero img" />
      </picture>
      <div className="hero-title">
        <h1 className="h1">outdoors</h1>
        <span className="sh1">is where life happens</span>
        <button
          className="btn outline white upper-small"
          onClick={handleHashLink}
        >
          discover our tours
        </button>
      </div>
    </section>
  );
};

export default Hero;
