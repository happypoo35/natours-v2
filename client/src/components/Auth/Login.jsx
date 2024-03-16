import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useLoginMutation } from "app/auth.api";

const Login = () => {
  const [login] = useLoginMutation();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const from = state?.from || "/";

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter a valid email address"),
    password: yup.string().required("Please enter your password"),
  });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      setError("email", {
        type: "manual",
        message: ` `,
      });
      setError("password", {
        type: "manual",
        message: err.data.message,
      });
      setTimeout(() => {
        clearErrors();
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form card" noValidate>
      <header className="form-header">
        <h2 className="h3 accent">Log in to your account</h2>
        <p>
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-link">
            Create a new account
          </Link>
        </p>
      </header>
      <div className="form-fields">
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
      </div>
      <div className="form-footer">
        <button className="btn primary upper" action="submit">
          Login
        </button>
        <Link
          to="/password-recovery"
          state={{ from: pathname }}
          className="text-link"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
};

export default Login;
