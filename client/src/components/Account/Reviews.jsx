import { FiStar, FiFrown } from "react-icons/fi";
import { HashLink } from "react-router-hash-link";

import { useSelector } from "react-redux";
import { selectUserReviews } from "features/user.slice";

const Reviews = () => {
  const reviews = useSelector(selectUserReviews);

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">Your reviews</h2>
      {reviews.length ? (
        <div className="account-content-list reviews">
          {reviews?.map((review, id) => (
            <HashLink
              to={`/tours/${review.tour.slug}#review`}
              key={id}
              arialabel={review.tour?.name}
              className="list-item"
            >
              <header>
                <h4 className="h4">{review.tour?.name}</h4>
                <div className="rating">
                  {[...Array(5).keys()].map((el) => (
                    <FiStar
                      key={el}
                      className={
                        review.rating
                          ? el + 1 > review.rating && "gray"
                          : "light-gray"
                      }
                    />
                  ))}
                </div>
              </header>
              <p>{review.review}</p>
            </HashLink>
          ))}
        </div>
      ) : (
        <div className="account-content-empty">
          <FiFrown />
          <span>You haven't left any reviews yet</span>
        </div>
      )}
    </section>
  );
};

export default Reviews;
