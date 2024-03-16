import { useCallback, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLocale, useSearch, useWindowSize } from "hooks";
import {
  FiChevronDown,
  FiCornerLeftUp,
  FiTrash2,
  FiStar,
} from "react-icons/fi";
import { Field } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "app/reviews.api";
import { selectManageReviewsQuery } from "features/search.slice";
import { resetModal, selectIsConfirmed, setModal } from "features/global.slice";

const ReviewsList = () => {
  const { desktop } = useWindowSize();
  const { search, add, handleActive } = useSearch(
    selectManageReviewsQuery,
    "manageReviews"
  );

  const { data: reviews } = useGetReviewsQuery({ query: search });

  const options = desktop
    ? { month: "numeric", hour: "numeric", minute: "numeric" }
    : { month: "numeric" };

  const localeDate = useLocale({
    options,
    format: "ru-RU",
  });

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">Manage reviews</h2>
      <div className="grid-table col3 manage-tours">
        <div className="grid-table-header">
          <span
            className={`grid-table-sort ${handleActive("tour")}`}
            onClick={() => add("sort", "tour")}
          >
            Tour name
            {handleActive("tour") && <FiChevronDown />}
          </span>
          <span
            className={`grid-table-sort ${handleActive("user")}`}
            onClick={() => add("sort", "user")}
          >
            User
            {handleActive("user") && <FiChevronDown />}
          </span>
          <span
            className={`grid-table-sort ${handleActive("updatedAt")}`}
            onClick={() => add("sort", "updatedAt")}
          >
            Last changed
            {handleActive("updatedAt") && <FiChevronDown />}
          </span>
        </div>
        {reviews?.map((el) => (
          <Link to={el.id} key={el._id} className="grid-table-item">
            <b>{el.tour?.name || "-"}</b>
            <b>{el.user?.email || "-"}</b>
            <span>{localeDate(el.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Review = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { from } = state || {};

  const dispatch = useDispatch();
  const [deleteReview] = useDeleteReviewMutation();
  const isConfirmed = useSelector(selectIsConfirmed);
  const { reviewId } = useParams();

  const { data: review } = useGetReviewByIdQuery(reviewId);

  const handleModal = () => {
    dispatch(
      setModal({
        title: "Delete review",
        text: "Are you sure you want to permanently delete this review? You can't undo this action",
      })
    );
  };

  const handleDeleteReview = useCallback(async () => {
    try {
      await deleteReview(review?.id);
      navigate("/account/manage-reviews", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }, [deleteReview, review?.id, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(resetModal());
      handleDeleteReview();
    }
  }, [dispatch, isConfirmed, handleDeleteReview]);

  if (!review) return null;

  return (
    <section className="account-content-section manage">
      <header className="account-content-header">
        <Link to={from || "/account/manage-reviews"}>
          <h2 className="h4 accent">
            <FiCornerLeftUp />
            Review
          </h2>
        </Link>
        <div className="account-content-header-buttons">
          <FiTrash2 onClick={handleModal} />
        </div>
      </header>
      <ReviewForm review={review} />
    </section>
  );
};

const ReviewForm = ({ review }) => {
  const { mobile } = useWindowSize();

  const [updateReview] = useUpdateReviewMutation();

  const schema = yup.object().shape({
    review: yup.string().required("Review can not be empty"),
  });

  const defaultValues = useMemo(
    () => ({ review: review.review, rating: review.rating }),
    [review]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const rating = watch("rating");
  const isDirty = Object.keys(dirtyFields).length > 0;

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = async (data) => {
    Object.keys(data).forEach((key) => {
      if (!(key in dirtyFields)) {
        delete data[key];
      }
    });

    try {
      await updateReview({ body: data, reviewId: review.id }).unwrap();
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-fields">
        <div
          style={{
            display: "flex",
            gap: mobile ? ".5rem" : "2rem",
            flexDirection: mobile ? "column" : undefined,
          }}
        >
          <p>
            Tour:{" "}
            <Link
              to={`/account/manage-tours/${review.tour.id}`}
              className="text-link"
              style={{ fontWeight: "400" }}
            >
              {review.tour.name}
            </Link>
          </p>
          <p>
            User:{" "}
            <Link
              to={`/account/manage-users/${review.user.id}`}
              className="text-link"
              style={{ fontWeight: "400" }}
            >
              {review.user.email}
            </Link>
          </p>
        </div>
        <Field
          ta
          rows={4}
          label="Review"
          error={errors.review?.message}
          {...register("review")}
        />
        <div className="rating-select">
          {[...Array(5).keys()].map((el) => (
            <FiStar
              key={el}
              className={el + 1 > rating && "gray"}
              onClick={() =>
                setValue("rating", rating !== el + 1 ? el + 1 : null, {
                  shouldDirty: true,
                })
              }
            />
          ))}
        </div>
      </div>
      <div className="form-buttons">
        <button type="button" className="btn-text" onClick={() => reset()}>
          Reset changes
        </button>
        <button
          type="submit"
          disabled={!isDirty}
          className={`btn primary upper-small small ${
            !isDirty ? "disabled" : ""
          }`}
        >
          save changes
        </button>
      </div>
    </form>
  );
};

const ManageReviews = { ReviewsList, Review };

export default ManageReviews;
