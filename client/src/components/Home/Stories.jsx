import bg from "assets/giphy.gif";
import rev1 from "assets/rev-1.jpg";
import rev2 from "assets/rev-2.jpg";

const storiesData = [
  {
    img: rev1,
    user: "Mary Smith",
    title: "I had the best week ever with my family",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, ipsum sapiente aspernatur libero repellat quis consequatur ducimus quam nisi exercitationem omnis",
  },
  {
    img: rev2,
    user: "Jack Wilson",
    title: "Wow! My life is completely different now",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, ipsum sapiente aspernatur libero repellat quis consequatur ducimus quam nisi exercitationem omnis",
  },
];

const Stories = () => {
  return (
    <section className="stories pad" aria-label="stories">
      <img src={bg} className="bg-img" alt="stories background" />
      <div className="container">
        <h2 className="h2">We make people genuinely happy</h2>
        <div className="stories-list">
          {storiesData.map((el, id) => (
            <article className="story" key={id} aria-label={`${el.user} story`}>
              <figure className="story-img">
                <img src={el.img} alt="user" />
                <figcaption>{el.user}</figcaption>
              </figure>
              <div className="story-text">
                <h4 className="h4">{el.title}</h4>
                <p>{el.text}</p>
              </div>
            </article>
          ))}
        </div>
        <button className="btn outline white">
          Read all stories<span className="icon">→</span>
        </button>
      </div>
    </section>
  );
};

export default Stories;
