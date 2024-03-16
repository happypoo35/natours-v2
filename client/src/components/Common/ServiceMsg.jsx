import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMsg, resetMessage } from "features/global.slice";

const ServiceMsg = () => {
  const messageRef = useRef(null);

  const { type, msg } = useSelector(selectMsg);
  const dispatch = useDispatch();

  useEffect(() => {
    messageRef?.current?.addEventListener("animationend", () =>
      dispatch(resetMessage())
    );
  }, [msg, dispatch]);

  if (!msg) return null;

  return (
    <div ref={messageRef} className={`service-msg ${type}`}>
      <span>{msg}</span>
    </div>
  );
};

export default ServiceMsg;
