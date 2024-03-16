import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import Tours from "./Tours";
import Stories from "./Stories";
import Cta from "./Cta";

const Home = () => {
  return (
    <main className="main">
      <Hero />
      <About />
      <Features />
      <Tours />
      <Stories />
      <Cta />
    </main>
  );
};

export default Home;
