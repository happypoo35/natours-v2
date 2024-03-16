import { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { confirmModal, resetModal, selectModal } from "features/global.slice";

const Modal = () => {
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const { title, text } = useSelector(selectModal);

  useEffect(() => {
    if (!title) return;

    const closeModal = (e) => {
      if (!modalRef.current.contains(e.target)) {
        dispatch(resetModal());
      }
    };

    document.addEventListener("mousedown", closeModal);
    return () => document.removeEventListener("mousedown", closeModal);
  });

  if (!title) return null;

  return (
    <div className="modal">
      <article className="modal-card card" ref={modalRef}>
        <span className="modal-title">{title}</span>
        <p>{text}</p>
        <div className="form-buttons">
          <button
            type="button"
            className="btn-text"
            onClick={() => dispatch(resetModal())}
          >
            Cancel
          </button>
          <button
            className="btn danger upper-small small"
            onClick={() => dispatch(confirmModal())}
          >
            {title}
          </button>
        </div>
      </article>
    </div>
  );
};

export default Modal;
