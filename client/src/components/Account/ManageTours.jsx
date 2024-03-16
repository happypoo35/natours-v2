import { useCallback, useEffect, useMemo } from "react";
import { useLocale, useSearch } from "hooks";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { DatePicker, Field, ImgInput, Select } from "components/Common/Inputs";
import { TabNav } from "components/Common";
import {
  FiCornerLeftUp,
  FiTrash2,
  FiExternalLink,
  FiChevronDown,
} from "react-icons/fi";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  useCreateTourMutation,
  useDeleteTourMutation,
  useGetToursQuery,
  useSingleTourByIdQuery,
  useUpdateTourByIDMutation,
} from "app/tours.api";
import { useAdminGetUsersQuery } from "app/users.api";
import { resetModal, selectIsConfirmed, setModal } from "features/global.slice";
import { selectManageToursQuery } from "features/search.slice";
import { useGetReviewsQuery } from "app/reviews.api";
import { useGetBookingsQuery } from "app/bookings.api";

const ToursList = () => {
  const { search, add, handleActive } = useSearch(
    selectManageToursQuery,
    "manageTours"
  );

  const { data: tours } = useGetToursQuery(search);

  const localeDate = useLocale({
    options: {
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    format: "ru-RU",
  });

  return (
    <section className="account-content-section">
      <header className="account-content-header">
        <h2 className="h4 accent">Manage tours</h2>
        <Link to="new-tour" className="btn small primary">
          + New
        </Link>
      </header>
      <div className="grid-table col2 manage-tours">
        <div className="grid-table-header">
          <span
            className={`grid-table-sort ${handleActive("name")}`}
            onClick={() => add("sort", "name")}
          >
            Name
            {handleActive("name") && <FiChevronDown />}
          </span>
          <span
            className={`grid-table-sort ${handleActive("updatedAt")}`}
            onClick={() => add("sort", "updatedAt")}
          >
            Last changed
            {handleActive("updatedAt") && <FiChevronDown />}
          </span>
        </div>
        {tours?.data.map((el) => (
          <Link key={el.id} to={el.id} className="grid-table-item">
            <b>{el.name}</b>
            <span>{localeDate(el.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const initialValues = {
  name: "",
  summary: "",
  description: "",
  difficulty: "",
  price: "",
  maxGroupSize: "",
  duration: "",
  startDates: [],
  leadGuide: "",
  guides: [],
  imageCover: "",
  images: [],
  startLocation: {
    address: "",
    description: "",
    coordinates: [],
  },
  locations: [
    {
      description: "",
      day: "",
      coordinates: [],
    },
  ],
};

const Tour = ({ newTour }) => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const { data: tourData } = useSingleTourByIdQuery(tourId, {
    skip: newTour,
  });
  const { data: leadGuides } = useAdminGetUsersQuery("role=lead-guide");
  const { data: guides } = useAdminGetUsersQuery("role=guide");

  const tour = tourData || initialValues;

  const dispatch = useDispatch();
  const [deleteTour] = useDeleteTourMutation();
  const isConfirmed = useSelector(selectIsConfirmed);

  const handleModal = () => {
    dispatch(
      setModal({
        title: "Delete tour",
        text: "Are you sure you want to permanently delete this tour? You can't undo this action",
      })
    );
  };

  const handleDeleteTour = useCallback(async () => {
    try {
      await deleteTour(tour?.id);
      navigate("/account/manage-tours", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }, [deleteTour, tour?.id, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(resetModal());
      handleDeleteTour();
    }
  }, [dispatch, isConfirmed, handleDeleteTour]);

  if (!tour || !guides || !leadGuides) return null;

  return (
    <section className="account-content-section manage">
      <header className="account-content-header">
        <Link to="/account/manage-tours">
          <h2 className="h4 accent">
            <FiCornerLeftUp />
            {newTour ? "Create new tour" : tour.name}
          </h2>
        </Link>
        {!newTour && (
          <div className="account-content-header-buttons">
            <Link to={`/tours/${tour.slug}`}>
              <FiExternalLink />
            </Link>
            <FiTrash2 onClick={handleModal} />
          </div>
        )}
      </header>
      {!newTour && <TabNav arr={["info", "bookings", "reviews"]} />}
      <Outlet context={{ tour, leadGuides, guides, newTour }} />
    </section>
  );
};

const TourForm = () => {
  const { tour, leadGuides, guides, newTour } = useOutletContext();
  const navigate = useNavigate();

  const [updateTour] = useUpdateTourByIDMutation();
  const [createTour] = useCreateTourMutation();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Can not be empty")
      .matches(/\w/, "Can not contain symbols")
      .min(4, "Tour name can not be less than 3 characters")
      .max(40, "Tour name can not be greater than 40 characters"),
    summary: yup.string().required("Summary can not be empty"),
    description: yup.string().required("Description can not be empty"),
    difficulty: yup.string().required("Select tour difficulty"),
    price: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("Price can not be empty"),
    maxGroupSize: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("Group size can not be empty"),
    duration: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("Duration can not be empty"),
    imageCover: yup.mixed(),
    images: yup.array().of(yup.mixed()),
    startDates: yup.array().of(yup.string().required("Date can not be empty")),
    leadGuide: yup.string().required("Can not be empty"),
    guides: yup.array().of(yup.string().required("Can not be empty")),
    startLocation: yup.object().shape({
      address: yup.string().required("Can not be empty"),
      description: yup.string().required("Can not be empty"),
      coordinates: yup.array().of(
        yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("Should be a number")
      ),
    }),
    locations: yup.array().of(
      yup.object().shape({
        description: yup.string().required("Can not be empty"),
        day: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("Should be a number"),
        coordinates: yup.array().of(
          yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .required("Should be a number")
        ),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: tour.name,
      summary: tour.summary,
      description: tour.description,
      difficulty: tour.difficulty,
      price: tour.price,
      maxGroupSize: tour.maxGroupSize,
      duration: tour.duration,
      startDates: tour.startDates.length
        ? tour.startDates.map((el) => new Date(el).toISOString().split("T")[0])
        : [""],
      leadGuide: tour.guides.find((el) => el.role === "lead-guide")?.name || "",
      guides: tour.guides.reduce((acc, el) => {
        if (el.role !== "lead-guide") {
          acc.push(el.name);
        }
        return acc;
      }, []),
      startLocation: tour.startLocation,
      locations: tour.locations,
    }),
    [tour]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const data = useWatch({
    control: control,
  });

  const imageCover = data.imageCover;
  const images = data.images;

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "startDates",
  });

  const {
    fields: guidesFields,
    append: appendGuide,
    remove: removeGuide,
  } = useFieldArray({
    control,
    name: "guides",
  });

  const {
    fields: locationsFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: "locations",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const isDirty = Object.keys(dirtyFields).length > 0;

  const onSubmit = async (data) => {
    const body = {};
    const formData = new FormData();

    Object.keys(data).map((key, id) => {
      if (key in dirtyFields) {
        switch (key) {
          case "imageCover":
            if (data[key].length) {
              formData.append(key, data[key][0]);
            }
            break;
          case "images":
            data[key].map((img, id) => {
              if (img.length) {
                formData.append(key, img[0]);
                formData.append(img[0].name, id);
              }
              if (tour.images[id]) {
                formData.append("prevImages", tour.images[id]);
              } else {
                formData.append(
                  "prevImages",
                  "https://res.cloudinary.com/dmqqshihc/image/upload/tours/default.svg"
                );
              }
              return null;
            });
            break;
          case "startDates":
            body[key] = [];
            data[key].map((el) => body[key].push(new Date(el).toISOString()));
            break;
          case "leadGuide":
            const guide = leadGuides.find((i) => i.name === data[key]);
            if (!body.guides) body.guides = [];
            body.guides.push(guide.id);
            break;
          case "guides":
            if (!body.guides) body.guides = [];
            data[key].map((el) => {
              const guide = guides.find((i) => i.name === el);
              body.guides.push(guide.id);
              return null;
            });
            break;
          default:
            body[key] = data[key];
        }
      }
      return null;
    });

    if (Object.keys(body).length) {
      try {
        if (newTour) {
          const { data: createdTour } = await createTour(body).unwrap();
          await updateTour({ body: formData, id: createdTour.id });
          navigate(`/account/manage-tours/${createdTour.id}`);
        } else {
          await updateTour({ body, id: tour.id }).unwrap();
        }
        window.scrollTo(0, 0);
        document.activeElement.blur();
      } catch (err) {
        console.log(err);
      }
    }

    if (!newTour && [...formData].length) {
      try {
        await updateTour({ body: formData, id: tour.id }).unwrap();
        document.activeElement.blur();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-fields">
        <Field
          label="tour name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Select
          label="difficulty"
          error={errors.difficulty?.message}
          options={["easy", "medium", "difficult"]}
          {...register("difficulty")}
        />
        <div className="form-fields-group">
          <Field
            label="price"
            type="number"
            error={errors.price?.message}
            {...register("price", {
              valueAsNumber: true,
            })}
          />
          <Field
            label="max group size"
            type="number"
            error={errors.maxGroupSize?.message}
            {...register("maxGroupSize", {
              valueAsNumber: true,
            })}
          />
          <Field
            label="duration"
            type="number"
            error={errors.duration?.message}
            {...register("duration", {
              valueAsNumber: true,
            })}
          />
        </div>
        <Field
          label="summary"
          ta
          error={errors.summary?.message}
          {...register("summary")}
        />
        <Field
          label="description"
          ta
          rows={7}
          error={errors.description?.message}
          {...register("description")}
        />
        <div className="form-item">
          <span className="form-item-label">Tour images</span>
          <div className="form-images-container">
            <ImgInput
              preview={
                !imageCover || !imageCover.length
                  ? tour.imageCover
                    ? tour.imageCover
                    : null
                  : URL.createObjectURL(imageCover[0])
              }
              {...register("imageCover")}
            />
            <div className="images">
              {[...Array(3).keys()].map((el) => (
                <ImgInput
                  key={el}
                  preview={
                    !images?.[el] || !images?.[el]?.length
                      ? tour.images[el]
                        ? tour.images[el]
                        : null
                      : URL.createObjectURL(images[el][0])
                  }
                  {...register(`images[${el}]`)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="form-item">
          <span className="form-item-label">Start dates</span>
          <div className="form-fields">
            {dateFields.map((el, id) => (
              <div className="form-field" key={id}>
                <DatePicker
                  key={el?.id}
                  error={errors.startDates?.[id]?.message}
                  {...register(`startDates[${id}]`)}
                />
                {id !== 0 && (
                  <FiTrash2
                    className="form-delete"
                    onClick={() => removeDate(id)}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-text"
              onClick={() => appendDate()}
            >
              + Add date
            </button>
          </div>
        </div>
        <div className="form-item">
          <span className="form-item-label">Guides</span>
          <div className="form-fields">
            <Select
              options={leadGuides.map((el) => el.name)}
              label="lead guide"
              error={errors.leadGuide?.message}
              {...register("leadGuide")}
            />
            {guidesFields.map((el, id) => (
              <div className="form-field" key={id}>
                <Select
                  key={el?.id}
                  label="guide"
                  options={guides.map((el) => el.name)}
                  error={errors.guides?.[id]?.message}
                  {...register(`guides[${id}]`)}
                />
                <FiTrash2
                  className="form-delete"
                  onClick={() => removeGuide(id)}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-text"
              onClick={() => appendGuide()}
            >
              + Add guide
            </button>
          </div>
        </div>
        <div className="form-item">
          <span className="form-item-label">Start location</span>
          <div className="form-fields">
            <Field
              label="description"
              error={errors.startLocation?.description?.message}
              {...register("startLocation.description")}
            />
            <Field
              label="address"
              error={errors.startLocation?.address?.message}
              {...register("startLocation.address")}
            />
            <div className="form-fields-group">
              <Field
                label="lat"
                error={errors.startLocation?.coordinates?.[0]?.message}
                {...register("startLocation.coordinates[0]", {
                  valueAsNumber: true,
                })}
              />
              <Field
                label="long"
                error={errors.startLocation?.coordinates?.[1]?.message}
                {...register("startLocation.coordinates[1]", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        </div>
        <div className="form-fields">
          {locationsFields.map((el, id) => (
            <div className="form-item" key={id}>
              <div className="form-item-header">
                <span className="form-item-label">Location {id + 1}</span>
                {id !== 0 && (
                  <FiTrash2
                    className="form-delete"
                    onClick={() => removeLocation(id)}
                  />
                )}
              </div>
              <div className="form-fields">
                <Field
                  label="description"
                  error={errors.locations?.[id]?.description?.message}
                  {...register(`locations.${id}.description`)}
                />

                <div className="form-fields-group">
                  <Field
                    label="day"
                    className="small"
                    error={errors.locations?.[id]?.day?.message}
                    {...register(`locations.${id}.day`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Field
                    label="lat"
                    error={errors.locations?.[id]?.coordinates?.[0]?.message}
                    {...register(`locations.${id}.coordinates[0]`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Field
                    label="long"
                    error={errors.locations?.[id]?.coordinates?.[1]?.message}
                    {...register(`locations.${id}.coordinates[1]`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn-text"
            onClick={() => appendLocation()}
          >
            + Add location
          </button>
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
          {newTour ? "create tour" : "save changes"}
        </button>
      </div>
    </form>
  );
};

const TourBookings = () => {
  const { pathname } = useLocation();
  const { tour } = useOutletContext();
  const { search, add, handleActive } = useSearch(
    selectManageToursQuery,
    "manageTours"
  );

  const { data: bookings } = useGetBookingsQuery({
    tourId: tour.id,
    query: search,
  });

  const localeDate = useLocale({
    options: {
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    format: "ru-RU",
  });

  if (!bookings) return null;

  if (!bookings?.length)
    return (
      <div className="account-content-empty">
        <span>This tour hasn't been booked yet</span>
      </div>
    );

  return (
    <div className="grid-table col2 manage-tours">
      <div className="grid-table-header">
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
      {bookings?.map((el) => (
        <Link
          key={el._id}
          to={`/account/manage-bookings/${el._id}`}
          state={{ from: pathname }}
          className="grid-table-item"
        >
          <b>{el.user.email}</b>
          <span>{localeDate(el.updatedAt)}</span>
        </Link>
      ))}
    </div>
  );
};

const TourReviews = () => {
  const { pathname } = useLocation();
  const { tour } = useOutletContext();
  const { search, add, handleActive } = useSearch(
    selectManageToursQuery,
    "manageTours"
  );

  const { data: reviews } = useGetReviewsQuery({
    tourId: tour.id,
    query: search,
  });

  const localeDate = useLocale({
    options: {
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    format: "ru-RU",
  });

  if (!reviews) return null;

  if (!reviews?.length)
    return (
      <div className="account-content-empty">
        <span>This tour doesn't have any reviews yet</span>
      </div>
    );

  return (
    <div className="grid-table col2 manage-tours">
      <div className="grid-table-header">
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
        <Link
          key={el._id}
          to={`/account/manage-reviews/${el.id}`}
          state={{ from: pathname }}
          className="grid-table-item"
        >
          <b>{el.user.email}</b>
          <span>{localeDate(el.updatedAt)}</span>
        </Link>
      ))}
    </div>
  );
};

const ManageTours = { ToursList, Tour, TourForm, TourBookings, TourReviews };

export default ManageTours;
