import { useEffect, useState, forwardRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { FiArrowDown, FiCalendar, FiImage } from "react-icons/fi";
import { useDebounce } from "hooks";

export const Field = forwardRef(
  ({ helperlink, error, label, ta, className, ...props }, ref) => {
    const InputTag = ta ? "textarea" : "input";

    return (
      <div
        className={
          error ? `field error ${className || ""}` : `field ${className || ""}`
        }
      >
        <InputTag
          ref={ref}
          {...props}
          id={`${props.name}-input`}
          placeholder=" "
        />
        <label htmlFor={`${props.name}-input`}>{label}</label>
        {error && error !== ` ` && <span className="error-msg">{error}</span>}
        {helperlink}
      </div>
    );
  }
);

export const Select = forwardRef(
  ({ helperlink, error, label, options, ...props }, ref) => {
    return (
      <div className={error ? "field error" : "field"}>
        <select ref={ref} {...props} id={`${props.name}-input`} placeholder=" ">
          {options?.map((el, id) => (
            <option key={id} value={el}>
              {el}
            </option>
          ))}
        </select>
        <FiArrowDown className="select-arrow" />
        <label htmlFor={`${props.name}-input`}>{label}</label>
        {error && error !== ` ` && <span className="error-msg">{error}</span>}
        {helperlink}
      </div>
    );
  }
);

export const DatePicker = forwardRef(
  ({ helperlink, error, label, ...props }, ref) => {
    return (
      <div className={error ? "field error" : "field"}>
        <input
          type="date"
          ref={ref}
          {...props}
          id={`${props.name}-input`}
          placeholder=" "
        />
        <FiCalendar />
        <label htmlFor={`${props.name}-input`}>{label}</label>
        {error && error !== ` ` && <span className="error-msg">{error}</span>}
        {helperlink}
      </div>
    );
  }
);

export const ImgInput = forwardRef(
  ({ error, label, preview, avatar, ...props }, ref) => {
    return (
      <div className={`input-img${avatar ? "-avatar" : ""}`}>
        {preview && !preview.includes("tours/default.svg") ? (
          <img className="input-img-preview" src={preview} alt={props.name} />
        ) : (
          <div className="input-img-blank">
            <FiImage />
          </div>
        )}
        <label htmlFor={`${props.name}-input`} className="btn-text accent">
          Upload new photo
        </label>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={ref}
          {...props}
          id={`${props.name}-input`}
        />
        {error && error !== ` ` && <span className="error-msg">{error}</span>}
      </div>
    );
  }
);

export const Checkbox = forwardRef(({ label, ...rest }, ref) => (
  <div className="checkbox-container">
    <label className="checkbox">
      {label}
      <input type="checkbox" ref={ref} {...rest} />
      <span className="checkmark"></span>
    </label>
  </div>
));

export const RangeSlider = ({ min, max, add }) => {
  const [values, setValues] = useState([min, max]);
  const debouncedValues = useDebounce(values, 500);

  useEffect(() => {
    const isSetMin = debouncedValues[0] !== min;
    const isSetMax = debouncedValues[1] !== max;

    add(
      "numericFilters",
      `${isSetMin ? `price>=${debouncedValues[0]}` : ""}${
        isSetMin && isSetMax ? "," : ""
      }${isSetMax ? `price<=${debouncedValues[1]}` : ""}`
    );
  }, [add, debouncedValues, min, max]);

  return (
    <Range
      values={values}
      step={1}
      min={min}
      max={max}
      onChange={(values) => setValues(values)}
      renderTrack={({ props, children }) => (
        <div
          className="range"
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{ ...props.style }}
        >
          <div
            className="range-track"
            ref={props.ref}
            style={{
              background: getTrackBackground({
                values,
                colors: ["#ccc", "#54c47a", "#ccc"],
                min: min,
                max: max,
              }),
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ index, props, isDragged }) => (
        <div
          {...props}
          className="range-thumb"
          style={{ ...props.style, transform: "unset" }}
        >
          <div className="range-thumb-tooltip">{values[index]?.toFixed(1)}</div>
          <div
            className="range-thumb-indicator"
            style={{
              backgroundColor: isDragged ? "#54c47a" : "#CCC",
            }}
          />
        </div>
      )}
    />
  );
};
