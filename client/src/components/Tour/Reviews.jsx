import ReviewCard from "./ReviewCard";
import { useWindowSize } from "hooks";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/scss";

const Reviews = ({ reviews }) => {
  const { mobile, tablet } = useWindowSize();
  const total = reviews.length;

  const pagination = {
    clickable: true,
    renderBullet: (_, className) => {
      return `<span class=${className}></span>`;
    },
  };

  const handleSlidesPerView = () => {
    if (mobile) return 1;

    return Math.min(total, tablet ? 2 : 3);
  };

  const slidesPerView = handleSlidesPerView();

  return (
    <section className="reviews pad">
      {reviews.length > 0 && (
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={30}
          grabCursor={true}
          modules={[Pagination]}
          pagination={total > slidesPerView ? pagination : false}
          className="container"
        >
          {reviews.map((el) => (
            <SwiperSlide key={el._id}>
              <ReviewCard review={el} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default Reviews;
