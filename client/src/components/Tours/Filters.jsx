import { useEffect, useState } from "react";
import { FiChevronsDown, FiX } from "react-icons/fi";
import { useDebounce, useSearch } from "hooks";
import { Field, RangeSlider } from "components/Common/Inputs";
import Filter from "./Filter";

import { useSelector } from "react-redux";
import { useStatsQuery } from "app/tours.api";
import { selectToursQuery } from "features/search.slice";

const sortData = [
  { name: "price", value: "price" },
  { name: "duration", value: "duration" },
  { name: "group size", value: "maxGroupSize" },
];

const Filters = ({ pageCount }) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState(0);
  const debouncedName = useDebounce(name, 500);

  const { add, clearOne, clearAll, handleActive } = useSearch(
    selectToursQuery,
    "tours"
  );

  const { data: stats } = useStatsQuery();
  const { difficulty, limit, page } = useSelector(selectToursQuery);

  const handleClearParam = (key) => {
    clearOne(key);
    if (key === "name") {
      setName("");
    }
    if (key === "price") {
      setKey((p) => p + 1);
    }
  };

  const handleClearAll = () => {
    clearAll();
    setName("");
    setKey((p) => p + 1);
  };

  useEffect(() => {
    if (page && page > pageCount) {
      clearOne("page");
    }
  }, [page, pageCount, clearOne]);

  useEffect(() => {
    add("name", debouncedName);
  }, [debouncedName, add]);

  return (
    <aside className="filters">
      <div className="filters-col">
        <Filter name="price" handleClearParam={handleClearParam}>
          {stats && (
            <RangeSlider
              min={stats.minPrice}
              max={stats.maxPrice}
              add={add}
              key={key}
            />
          )}
        </Filter>
        <Filter name="difficulty" handleClearParam={handleClearParam}>
          {["easy", "medium", "difficult"].map((el, id) => (
            <span
              key={id}
              onClick={() => add("difficulty", el)}
              className={`btn-filter ${difficulty?.includes(el) && "active"}`}
            >
              {el}
            </span>
          ))}
        </Filter>
        <Filter name="name" handleClearParam={handleClearParam}>
          <Field
            type="text"
            name="tourName"
            label="Search"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Filter>
      </div>
      <div className="filters-col">
        <Filter name="sort" handleClearParam={handleClearParam}>
          {sortData.map((el, id) => (
            <span
              key={id}
              className={`btn-filter ${handleActive(el.value)}`}
              onClick={() => add("sort", el.value)}
            >
              {el.name}
              <FiChevronsDown />
            </span>
          ))}
        </Filter>
        <Filter name="limit" handleClearParam={handleClearParam}>
          {[1, 2, 3, 5, 10].map((el, id) => (
            <span
              key={id}
              onClick={() => add("limit", limit !== el ? el : "")}
              className={`btn-filter limit ${limit === el && "active"}`}
            >
              {el}
            </span>
          ))}
        </Filter>
        <FiX className="clear-all" onClick={handleClearAll} />
      </div>
    </aside>
  );
};

export default Filters;
