import { useNavigate, useParams } from "react-router-dom";
import { Field } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useResetPasswordMutation } from "app/auth.api";

const ResetPassword = () => {
  const { token } = useParams();
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  const schema = yup.object().shape({
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
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await resetPassword({ body: data, token }).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form card" noValidate>
      <header className="form-header">
        <h2 className="h3 accent">Enter a new password</h2>
      </header>
      <div className="form-fields">
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
          Change password
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
