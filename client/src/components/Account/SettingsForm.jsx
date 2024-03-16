import { useEffect, useMemo } from "react";
import { Field, ImgInput } from "components/Common/Inputs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "app/auth.api";
import { selectUser } from "features/user.slice";

const SettingsForm = () => {
  const [update] = useUpdateUserMutation();
  const user = useSelector(selectUser);

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
  });
  const validationSchema = { resolver: yupResolver(schema) };

  const defaultValues = useMemo(
    () => ({ name: user.name, email: user.email }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    ...validationSchema,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const photo = watch("photo");

  const onSubmit = async (data) => {
    if (data.name === user.name) {
      delete data.name;
    }
    if (data.email === user.email) {
      delete data.email;
    }
    if (data.photo.length) {
      data.photo = data.photo[0];
    } else {
      delete data.photo;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (![...formData].length) return;

    try {
      await update(formData).unwrap();
      reset();
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
    <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
      <div className="settings-form-content">
        <h2 className="h4 accent">your account settings</h2>
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
          <ImgInput
            preview={
              !photo || !photo.length
                ? user.photo
                : URL.createObjectURL(photo[0])
            }
            avatar
            {...register("photo")}
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="btn-text" onClick={() => reset()}>
            Reset changes
          </button>
          <button type="submit" className="btn primary upper-small small">
            save settings
          </button>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
