import { FiStar } from "react-icons/fi";

const ReviewCard = ({ review }) => {
  return (
    <article arialabel={review.user.name} className="review-card">
      <div className="user">
        <img src={review.user.photo} alt={review.user.name} />
        <h4 className="h4">{review.user.name}</h4>
      </div>
      <p>{review.review}</p>
      <div className="rating">
        {[...Array(5).keys()].map((el) => (
          <FiStar
            key={el}
            className={
              review.rating ? el + 1 > review.rating && "gray" : "light-gray"
            }
          />
        ))}
      </div>
    </article>
  );
};

export default ReviewCard;
