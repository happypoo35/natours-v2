import { Field } from "components/Common/Inputs";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useUpdatePasswordMutation } from "app/auth.api";

const PasswordForm = () => {
  const [updatePassword] = useUpdatePasswordMutation();

  const schema = yup.object().shape({
    password: yup.string().required("Please enter your current password"),
    newPassword: yup
      .string()
      .required("Please enter a new password")
      .min(6, "Password can not be less than 6 characters"),
    newPasswordConfirm: yup
      .string()
      .required("Please confirm a new password")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  });
  const validationSchema = { resolver: yupResolver(schema) };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    ...validationSchema,
  });

  const onSubmit = async (data) => {
    try {
      await updatePassword(data).unwrap();
      document.activeElement.blur();
      reset();
    } catch (err) {
      setError("password", {
        type: "manual",
        message: "Invalid password",
      });
      setTimeout(() => {
        clearErrors();
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
      <div className="settings-form-content">
        <h2 className="h4 accent">password change</h2>
        <div className="form-fields">
          <Field
            type="password"
            name="password"
            label="current password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Field
            type="password"
            name="newPassword"
            label="new password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Field
            type="password"
            name="newPasswordConfirm"
            label="confirm new password"
            error={errors.newPasswordConfirm?.message}
            {...register("newPasswordConfirm")}
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="btn-text" onClick={() => reset()}>
            Reset changes
          </button>
          <button type="submit" className="btn primary upper-small small">
            save password
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasswordForm;
