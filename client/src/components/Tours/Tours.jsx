import TourCard from "./TourCard";
import Paging from "./Paging";
import Filters from "./Filters";
import { useSearch } from "hooks";
import { Spinner } from "components/Common";

import { useGetToursQuery } from "app/tours.api";
import { selectToursQuery } from "features/search.slice";

const Tours = () => {
  const { search, add } = useSearch(selectToursQuery, "tours");
  const { data: tours, isLoading } = useGetToursQuery(search);

  const cols = () => {
    if (tours?.stats.nbHits === 1) {
      return "25rem";
    }
    if (tours?.stats.nbHits === 2) {
      return "60rem";
    }
    return null;
  };

  if (isLoading) return <Spinner />;

  return (
    <main className="main-tours pad">
      <div className="container">
        <Filters pageCount={tours?.stats.pageCount} />
        <div className="tours-container">
          <section className="tours-list" style={{ maxWidth: cols() }}>
            {tours.data.map((el) => (
              <TourCard key={el.id} tour={el} />
            ))}
          </section>
        </div>
        {tours?.stats.pageCount > 1 && (
          <Paging add={add} pageCount={tours.stats.pageCount} />
        )}
      </div>
    </main>
  );
};

export default Tours;
