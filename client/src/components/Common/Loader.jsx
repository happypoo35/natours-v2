import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector((state) => {
    const newObj = { ...state.api.queries, ...state.api.mutations };
    return Object.values(newObj).some((entry) => entry.status === "pending");
  });

  if (!loading) return null;

  return (
    <div className="loader active">
      <div className="loader-progress"></div>
    </div>
  );
};

export default Loader;
