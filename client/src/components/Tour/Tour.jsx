import { useParams } from "react-router-dom";
import { Error, Spinner } from "components/Common";
import Cta from "./Cta";
import Description from "./Description";
import Hero from "./Hero";
import Map from "./Map";
import Pictures from "./Pictures";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";

import { useSelector } from "react-redux";
import { useSingleTourQuery } from "app/tours.api";
import { selectUserBookings, selectUserReviews } from "features/user.slice";

const Tour = () => {
  const { slug } = useParams();

  const { data, isLoading } = useSingleTourQuery(slug);
  const bookings = useSelector(selectUserBookings);
  const reviews = useSelector(selectUserReviews);

  const isBooked = bookings.some((el) => el.tour.slug === slug);
  const isReviewed = reviews.some((el) => el.tour === data?.id);

  if (isLoading) return <Spinner />;

  if (!data) return <Error />;

  return (
    <main className="main-tour">
      <Hero tour={data} />
      <Description tour={data} />
      <Pictures images={data.images} />
      <Map locations={data.locations} />
      <Reviews reviews={data.reviews} />
      {isBooked || isReviewed ? (
        <ReviewForm tourId={data.id} />
      ) : (
        <Cta duration={data.duration} images={data.images} tourId={data.id} />
      )}
    </main>
  );
};

export default Tour;
