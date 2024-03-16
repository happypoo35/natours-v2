import { useCallback, useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { Field } from "components/Common/Inputs";
import ReviewCard from "./ReviewCard";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  useAddTourReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "app/reviews.api";
import { selectUserReviews } from "features/user.slice";
import { resetModal, selectIsConfirmed, setModal } from "features/global.slice";

const ReviewForm = ({ tourId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(null);

  const dispatch = useDispatch();
  const [addReview] = useAddTourReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const review = useSelector(selectUserReviews).find(
    (el) => el.tour.id === tourId
  );
  const isConfirmed = useSelector(selectIsConfirmed);

  const schema = yup.object().shape({
    review: yup.string().required("Review can not be empty"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleEdit = () => {
    setValue("review", review.review);
    setRating(review.rating);
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setRating(null);
    setIsEditing(false);
  };

  const handleModal = () => {
    dispatch(
      setModal({
        title: "Delete review",
        text: "Are you sure you want to delete your review? You can't undo this action",
      })
    );
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteReview(review?.id).unwrap();
    } catch (err) {}
  }, [deleteReview, review?.id]);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(resetModal());
      handleDelete();
    }
  }, [dispatch, isConfirmed, handleDelete]);

  const onUpdateReview = async (data) => {
    if (rating) data.rating = rating;
    try {
      await updateReview({ body: data, reviewId: review.id }).unwrap();
      handleCancel();
    } catch (err) {}
  };

  const onSubmitReview = async (data) => {
    if (rating) data.rating = rating;
    try {
      await addReview({ body: data, tourId }).unwrap();
      reset();
      setRating(null);
    } catch (err) {}
  };

  if (review && !isEditing)
    return (
      <section className="review pad" id="review">
        <div className="container">
          <div className="form card">
            <div className="form-header">
              <h2 className="h3 accent">Your review</h2>
            </div>
            <ReviewCard review={review} />
            <div className="form-buttons">
              <button className="btn-text" onClick={handleModal}>
                Delete review
              </button>
              <button className="btn primary upper-small" onClick={handleEdit}>
                Edit review
              </button>
            </div>
          </div>
        </div>
      </section>
    );

  if (isEditing) {
    return (
      <section className="review pad">
        <div className="container">
          <form className="form card" onSubmit={handleSubmit(onUpdateReview)}>
            <header className="form-header">
              <h2 className="h3 accent">Update your review</h2>
            </header>
            <div className="form-fields">
              <Field
                ta
                rows={4}
                label="Your review"
                error={errors.review?.message}
                {...register("review")}
              />
              <div className="rating-select">
                {[...Array(5).keys()].map((el) => (
                  <FiStar
                    key={el}
                    className={el + 1 > rating && "gray"}
                    onClick={() =>
                      setRating((p) => (p !== el + 1 ? el + 1 : null))
                    }
                  />
                ))}
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-text" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn primary upper-small">
                Update review
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="review pad">
      <div className="container">
        <form className="form card" onSubmit={handleSubmit(onSubmitReview)}>
          <header className="form-header">
            <h2 className="h3 accent">enjoyed your experience?</h2>
            <p>
              Please leave a review to help other users find out about this tour
            </p>
          </header>
          <div className="form-fields">
            <Field
              ta
              rows={3}
              label="Your review"
              error={errors.review?.message}
              {...register("review")}
            />
            <div className="rating-select">
              {[...Array(5).keys()].map((el) => (
                <FiStar
                  key={el}
                  className={el + 1 > rating && "gray"}
                  onClick={() =>
                    setRating((p) => (p !== el + 1 ? el + 1 : null))
                  }
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn primary upper">
            Add review
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReviewForm;
