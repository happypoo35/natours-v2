import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addParam, clearAllParams, clearParam } from "features/search.slice";

const useSearch = (selector, loc) => {
  const [search, setSearch] = useSearchParams();

  const dispatch = useDispatch();
  const query = useSelector(selector);
  const { sort } = query;

  useEffect(() => {
    setSearch(query);
  }, [query, setSearch]);

  const handleActive = (name) => {
    if (!sort) return;
    const arr = sort.split(",");
    if (arr.includes(name)) {
      return "asc";
    }
    if (arr.includes(`-${name}`)) {
      return "desc";
    }
    return;
  };

  const add = useCallback(
    (key, value) => {
      dispatch(addParam({ loc, key, value }));
    },
    [dispatch, loc]
  );

  const clearOne = (key) => {
    dispatch(clearParam({ loc, key }));
  };

  const clearAll = () => {
    dispatch(clearAllParams(loc));
  };

  return { search: search.toString(), handleActive, add, clearOne, clearAll };
};

export default useSearch;
