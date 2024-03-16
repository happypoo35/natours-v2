import { useCallback, useEffect, useMemo } from "react";
import { useLocale, useSearch, useWindowSize } from "hooks";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { FiChevronDown, FiCornerLeftUp, FiTrash2 } from "react-icons/fi";
import { Field, ImgInput, Select } from "components/Common/Inputs";
import { TabNav } from "components/Common";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  useAdminGetUsersQuery,
  useAdminUpdateUserMutation,
  useAdminUserByIdQuery,
  useDeleteUserMutation,
} from "app/users.api";
import { selectManageUsersQuery } from "features/search.slice";
import { resetModal, selectIsConfirmed, setModal } from "features/global.slice";
import { useGetReviewsQuery } from "app/reviews.api";
import { useGetBookingsQuery } from "app/bookings.api";

const UsersList = () => {
  const { desktop } = useWindowSize();
  const { search, add, handleActive } = useSearch(
    selectManageUsersQuery,
    "manageUsers"
  );

  const { data: users } = useAdminGetUsersQuery(search);

  const options = desktop
    ? { month: "numeric", hour: "numeric", minute: "numeric" }
    : { month: "numeric" };

  const localeDate = useLocale({
    options,
    format: "ru-RU",
  });

  return (
    <section className="account-content-section">
      <h2 className="h4 accent">Manage users</h2>
      <div className="grid-table col3 manage-tours">
        <div className="grid-table-header">
          <span
            className={`grid-table-sort ${handleActive("email")}`}
            onClick={() => add("sort", "email")}
          >
            User
            {handleActive("email") && <FiChevronDown />}
          </span>
          <span
            className={`grid-table-sort ${handleActive("role")}`}
            onClick={() => add("sort", "role")}
          >
            Role
            {handleActive("role") && <FiChevronDown />}
          </span>
          <span
            className={`grid-table-sort ${handleActive("updatedAt")}`}
            onClick={() => add("sort", "updatedAt")}
          >
            Last changed
            {handleActive("updatedAt") && <FiChevronDown />}
          </span>
        </div>
        {users?.map((el) => (
          <Link to={el.id} key={el._id} className="grid-table-item">
            <b>{el.email}</b>
            <span>{el.role}</span>
            <span>{localeDate(el.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [deleteUser] = useDeleteUserMutation();
  const isConfirmed = useSelector(selectIsConfirmed);
  const { data: user } = useAdminUserByIdQuery(userId);

  const handleModal = () => {
    dispatch(
      setModal({
        title: "Delete user",
        text: "Are you sure you want to permanently delete this user? You can't undo this action",
      })
    );
  };

  const handleDeleteUser = useCallback(async () => {
    try {
      await deleteUser(user?.id);
      navigate("/account/manage-users", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }, [deleteUser, user?.id, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(resetModal());
      handleDeleteUser();
    }
  }, [dispatch, isConfirmed, handleDeleteUser]);

  if (!user) return null;

  return (
    <section className="account-content-section manage">
      <header className="account-content-header">
        <Link to="/account/manage-users">
          <h2 className="h4 accent">
            <FiCornerLeftUp />
            {user.name}
          </h2>
        </Link>
        <div className="account-content-header-buttons">
          <FiTrash2 onClick={handleModal} />
        </div>
      </header>
      <TabNav arr={["info", "bookings", "reviews"]} />
      <Outlet context={{ user }} />
    </section>
  );
};

const UserForm = () => {
  const { user } = useOutletContext();
  const [updateUser] = useAdminUpdateUserMutation();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Name can not be empty")
      .matches(/\w/, "Can not contain symbols")
      .min(3, "Name can not be less than 3 characters")
      .max(50, "Name can not be greater than 50 characters"),
    email: yup
      .string()
      .required("Email can not be empty")
      .email("Please enter a valid email address"),
    photo: yup.mixed(),
    role: yup.string().required("Role can not be empty"),
  });

  const defaultValues = useMemo(
    () => ({ name: user.name, email: user.email, role: user.role }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const isDirty = Object.keys(dirtyFields).length > 0;

  const photo = watch("photo");

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key in dirtyFields) {
        if (key === "photo") {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    if (![...formData].length) return;

    try {
      await updateUser({ body: formData, id: user.id }).unwrap();
      document.activeElement.blur();
    } catch (err) {
      err.data.errors.map((el) =>
        setError(el.key, {
          type: "manual",
          message: el.msg,
        })
      );
      setTimeout(() => {
        clearErrors();
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-fields">
        <Field
          label="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Field
          type="email"
          label="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Select
          label="role"
          error={errors.role?.message}
          options={["user", "guide", "lead-guide", "admin"]}
          {...register("role")}
        />
        <ImgInput
          preview={
            !photo || !photo.length ? user.photo : URL.createObjectURL(photo[0])
          }
          avatar
          {...register("photo")}
        />
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

const UserBookings = () => {
  const { pathname } = useLocation();
  const { user } = useOutletContext();
  const { search, add, handleActive } = useSearch(
    selectManageUsersQuery,
    "manageUsers"
  );

  const { data: bookings } = useGetBookingsQuery({
    userId: user.id,
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
        <span>This user hasn't booked anything yet</span>
      </div>
    );

  return (
    <div className="grid-table col2 manage-tours">
      <div className="grid-table-header">
        <span
          className={`grid-table-sort ${handleActive("tour")}`}
          onClick={() => add("sort", "tour")}
        >
          Tour
          {handleActive("tour") && <FiChevronDown />}
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
          <b>{el.tour.name}</b>
          <span>{localeDate(el.updatedAt)}</span>
        </Link>
      ))}
    </div>
  );
};

const UserReviews = () => {
  const { pathname } = useLocation();
  const { user } = useOutletContext();
  const { search, add, handleActive } = useSearch(
    selectManageUsersQuery,
    "manageUsers"
  );

  const { data: reviews } = useGetReviewsQuery({
    userId: user.id,
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
        <span>This user hasn't left any reviews yet</span>
      </div>
    );

  return (
    <div className="grid-table col2 manage-tours">
      <div className="grid-table-header">
        <span
          className={`grid-table-sort ${handleActive("tour")}`}
          onClick={() => add("sort", "tour")}
        >
          Tour
          {handleActive("tour") && <FiChevronDown />}
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
          <b>{el.tour.name}</b>
          <span>{localeDate(el.updatedAt)}</span>
        </Link>
      ))}
    </div>
  );
};

const ManageUsers = { UsersList, User, UserForm, UserReviews, UserBookings };

export default ManageUsers;
