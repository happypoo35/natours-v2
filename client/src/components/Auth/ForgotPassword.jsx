import { useLocation, useNavigate } from "react-router-dom";
import { Field } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForgotPasswordMutation } from "app/auth.api";
import { useEffect, useState } from "react";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from || "/";

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Please enter an email address")
      .email("Please enter a valid email address"),
  });

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const email = getValues("email");

  const cookies = document.cookie.split(";") || [];
  const codeTimeout = cookies
    .find((el) => el.includes("code_timeout"))
    ?.split("=")[1];

  const [timeLeft, setTimeLeft] = useState(codeTimeout - Date.now());
  const isTimeout = timeLeft > 0;

  useEffect(() => {
    const countDown = setInterval(() => {
      setTimeLeft(codeTimeout - new Date().getTime());
    }, 1000);
    return () => clearInterval(countDown);
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
    } catch (err) {
      setError("email", {
        type: "manual",
        message: err.data.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form card" noValidate>
      <header className="form-header">
        <h2 className="h3 accent">Password recovery</h2>
        <p>Please enter an email address provided during registration</p>
      </header>
      <div className="form-fields">
        <Field
          type="email"
          label="email"
          error={errors.email?.message}
          {...register("email")}
        />
        {(sent || codeTimeout) && (
          <p>
            We have sent you a link with password reset to {email}. If you did
            not receive an email you can send reset code again
            {isTimeout && ` in ${Math.floor(timeLeft / 1000)} seconds`}.
          </p>
        )}
      </div>
      <div className="form-buttons">
        <button
          className="btn-text"
          onClick={() => navigate(from, { replace: true })}
        >
          Cancel
        </button>
        <button
          disabled={isTimeout}
          className={
            isTimeout ? "btn primary upper disabled" : "btn primary upper"
          }
          action="submit"
        >
          Send reset code
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
