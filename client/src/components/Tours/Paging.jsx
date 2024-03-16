import { usePagination, useWindowSize } from "hooks";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { useSelector } from "react-redux";
import { selectToursQuery } from "features/search.slice";

const Paging = ({ pageCount, add }) => {
  const { mobile } = useWindowSize();
  const { page } = useSelector(selectToursQuery);
  const currentPage = page || 1;
  const pages = usePagination({
    pageCount,
    currentPage,
    siblingCount: mobile ? 0 : 1,
  });

  const handleAddParam = (key, value) => {
    value = value === 1 ? "" : value;
    add(key, value);
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      handleAddParam("page", currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleAddParam("page", currentPage - 1);
    }
  };

  const handleActive = (value) => {
    if (!page) return value === 1 ? "active" : "";
    if (value === page) return "active";
    return "";
  };

  return (
    <div className="paging">
      <button className="paging-arrow" onClick={handlePrevPage}>
        <FiArrowLeft />
      </button>
      {pages.map((el, id) => {
        if (el === "dots") {
          return (
            <span key={id} className="dots">
              &#8230;
            </span>
          );
        }
        return (
          <button
            key={id}
            className={`paging-btn ${handleActive(el)}`}
            onClick={() => handleAddParam("page", el)}
          >
            {el}
          </button>
        );
      })}
      <button className="paging-arrow" onClick={handleNextPage}>
        <FiArrowRight />
      </button>
    </div>
  );
};

export default Paging;
