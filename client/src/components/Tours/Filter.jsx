import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

import { useSelector } from "react-redux";
import { selectToursQuery } from "features/search.slice";
import { useWindowSize } from "hooks";

const Filter = ({ children, name, handleClearParam }) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(false);
  const filterRef = useRef(null);
  const { tablet } = useWindowSize();

  const query = useSelector(selectToursQuery);

  useEffect(() => {
    if (name in query || (name === "price" && "numericFilters" in query)) {
      return setSelected(true);
    }
    setSelected(false);
  }, [name, query]);

  useEffect(() => {
    const closeModal = (e) => {
      if (!filterRef.current.contains(e.target)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", closeModal);
    return () => document.removeEventListener("mousedown", closeModal);
  });

  const clearParam = (name) => {
    handleClearParam(name);
    setActive(false);
  };

  return (
    <div className="filters-item" ref={filterRef}>
      <button
        className={`btn outline small ${active ? "active" : ""} ${
          selected ? "selected" : ""
        }`}
        onClick={() => setActive((p) => (p = !p))}
      >
        {name} <FiChevronDown />
      </button>
      <div
        className={`filters-item-box card ${name} ${active ? "active" : ""}`}
      >
        <div className="content">
          {tablet && (
            <header className="content-header">
              <h4 className="h4">{name}</h4>
              <FiX onClick={() => setActive(false)} />
            </header>
          )}
          {children}
        </div>
        <button className="btn-text" onClick={() => clearParam(name)}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filter;
