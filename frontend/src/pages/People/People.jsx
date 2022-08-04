import { useCallback, useRef, useState } from "react";
import Loader from "../../components/shared/Loader/Loader";
import PeopleFollowCard from "../../components/shared/PeopleFollowCard/PeopleFollowCard";
import useFetchData from "../../hooks/useFetchData";

const People = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [urlName, setUrlName] = useState("peoples");
  const { peoples, loading, hasMore } = useFetchData("", pageNumber, urlName);

  //setting the observer to make infinite scrolling
  const observer = useRef();
  const lastRoomElementRef = useCallback(
    (node) => {
      //if a api call is going on then return
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //increse the page to request more rooms
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <div className="containerBox bg-blue-300 bg-opacity-5 rounded-lg p-6 mb-10 mt-8">
        <div className="w-full flex-none text-lg text-slate-100 font-bold uppercase leading-none pt-2 pb-10">
          People to follow
        </div>

        {peoples.map((people, index) => {
          if (peoples.length !== index - 1)
            return (
              <div ref={lastRoomElementRef} key={people.id}>
                <PeopleFollowCard people={people} />
              </div>
            );
          else
            return (
              <div key={people.id}>
                <PeopleFollowCard people={people} />
              </div>
            );
        })}
        {loading && <Loader message="Loading Peoples..." size={36} />}
        {hasMore === false && (
          <div>
            <h1 className="text-center text-lg font-medium py-6 text-blue-800 text-opacity-40">
              No more Peoples : )
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default People;
