const Pictures = ({ images }) => {
  return (
    <section className="pictures">
      {images.map((el, id) => (
        <picture key={id} className="pictures-img">
          <img src={el} alt="tour" />
        </picture>
      ))}
    </section>
  );
};

export default Pictures;
