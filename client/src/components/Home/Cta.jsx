import ctaImg from "assets/cta.jpg";
import { useNavigate } from "react-router-dom";
import { Field } from "components/Common/Inputs";

import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectUser } from "features/user.slice";

const Cta = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

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
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    navigate("/signup", { state: { user: data } });
  };

  if (user) return null;

  return (
    <section className="cta pad">
      <div className="container">
        <div className="cta-card card">
          <img src={ctaImg} className="bg-img" alt="bg" />
          <form onSubmit={handleSubmit(onSubmit)} className="cta-form">
            <h2 className="h2 accent">Start booking now</h2>
            <div className="form-fields">
              <Field
                name="name"
                label="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Field
                type="email"
                name="email"
                label="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            {/* <div className="radio-group">
              <div className="radio">
                <input type="radio" name="group" id="small" />
                <label htmlFor="small">Small tour group</label>
              </div>
              <div className="radio">
                <input type="radio" name="group" id="large" />
                <label htmlFor="large">Large tour group</label>
              </div>
            </div> */}
            <button type="submit" className="btn primary upper">
              Next step<span className="icon">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Cta;
