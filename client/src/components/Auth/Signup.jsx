import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useSignupMutation } from "app/auth.api";
import { useEffect } from "react";

const Signup = () => {
  const [signup] = useSignupMutation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const from = state?.from || "/";
  const user = state?.user;

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Please enter your name")
      .matches(/\w/, "Invalid symbols")
      .min(3, "Name can not be less than 3 characters")
      .max(50, "Name can not be greater than 50 characters"),
    email: yup
      .string()
      .required("Please enter an email address")
      .email("Please enter a valid email address"),
    password: yup
      .string()
      .required("Please enter a password")
      .min(6, "Password can not be less than 6 characters"),
    passwordConfirm: yup
      .string()
      .required("Please confirm a password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await signup(data).unwrap();
      navigate(from, { replace: true });
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

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form card" noValidate>
      <header className="form-header">
        <h2 className="h3 accent">Create your account</h2>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-link">
            Log in
          </Link>
        </p>
      </header>
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
        <Field
          type="password"
          label="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Field
          type="password"
          label="confirm password"
          {...register("passwordConfirm")}
          error={errors.passwordConfirm?.message}
        />
      </div>
      <div className="form-footer">
        <button className="btn primary upper" action="submit">
          Sign up
        </button>
      </div>
    </form>
  );
};

export default Signup;
