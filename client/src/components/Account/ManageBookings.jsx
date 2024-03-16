import { useCallback, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLocale, useSearch, useWindowSize } from "hooks";
import { FiChevronDown, FiCornerLeftUp, FiTrash2 } from "react-icons/fi";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { selectManageBookingsQuery } from "features/search.slice";
import {
  useDeleteBookingMutation,
  useGetBookingByIdQuery,
  useGetBookingsQuery,
  useUpdateBookingMutation,
} from "app/bookings.api";
import { resetModal, selectIsConfirmed, setModal } from "features/global.slice";
import { Checkbox, Field } from "components/Common/Inputs";

const BookingsList = () => {
  const { desktop } = useWindowSize();
  const { search, add, handleActive } = useSearch(
    selectManageBookingsQuery,
    "manageBookings"
  );

  const { data: bookings } = useGetBookingsQuery({ query: search });

  const options = desktop
    ? { month: "numeric", hour: "numeric", minute: "numeric" }
    : { month: "numeric" };

  const localeDate = useLocale({
    options,
    format: "ru-RU",
  });

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">Manage bookings</h2>
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
        {bookings?.map((el) => (
          <Link to={el._id} key={el._id} className="grid-table-item">
            <b>{el.tour?.name || "-"}</b>
            <b>{el.user?.email || "-"}</b>
            <span>{localeDate(el.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Booking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { from } = state || {};

  const dispatch = useDispatch();
  const [deleteBooking] = useDeleteBookingMutation();
  const isConfirmed = useSelector(selectIsConfirmed);

  const { data: booking } = useGetBookingByIdQuery(bookingId);

  const handleModal = () => {
    dispatch(
      setModal({
        title: "Delete booking",
        text: "Are you sure you want to permanently delete this booking? You can't undo this action",
      })
    );
  };

  const handleDeleteBooking = useCallback(async () => {
    try {
      await deleteBooking(booking?._id);
      navigate("/account/manage-bookings", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }, [deleteBooking, booking?._id, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(resetModal());
      handleDeleteBooking();
    }
  }, [dispatch, isConfirmed, handleDeleteBooking]);

  if (!booking) return null;

  return (
    <section className="account-content-section manage">
      <header className="account-content-header">
        <Link to={from || "/account/manage-bookings"}>
          <h2 className="h4 accent">
            <FiCornerLeftUp />
            Booking
          </h2>
        </Link>
        <div className="account-content-header-buttons">
          <FiTrash2 onClick={handleModal} />
        </div>
      </header>
      <BookingForm booking={booking} />
    </section>
  );
};

const BookingForm = ({ booking }) => {
  const [updateBooking] = useUpdateBookingMutation();
  const { mobile } = useWindowSize();

  const schema = yup.object().shape({
    paid: yup.boolean(),
    price: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("Price can not be empty"),
  });

  const defaultValues = useMemo(
    () => ({ paid: booking.paid, price: booking.price }),
    [booking]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

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
      await updateBooking({ body: data, bookingId: booking._id }).unwrap();
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
              to={`/account/manage-tours/${booking.tour.id}`}
              className="text-link"
              style={{ fontWeight: "400" }}
            >
              {booking.tour.name}
            </Link>
          </p>
          <p>
            User:{" "}
            <Link
              to={`/account/manage-users/${booking.user.id}`}
              className="text-link"
              style={{ fontWeight: "400" }}
            >
              {booking.user.email}
            </Link>
          </p>
        </div>
        <Field
          label="Amount"
          error={errors.price?.message}
          {...register("price", {
            valueAsNumber: true,
          })}
        />
        <Checkbox label="Is paid" {...register("paid")} />
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

const ManageBookings = { BookingsList, Booking };

export default ManageBookings;
