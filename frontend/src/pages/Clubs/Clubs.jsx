import { useCallback, useRef, useState } from "react";
import ClubCard from "../../components/shared/ClubCard/ClubCard";
import Loader from "../../components/shared/Loader/Loader";
import useFetchData from "../../hooks/useFetchData";

const PeopleFollowCard = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [urlName, setUrlName] = useState("clubs");
  const { clubs, loading, hasMore } = useFetchData("", pageNumber, urlName);

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
      <div className="containerBox bg-blue-300 bg-opacity-5 rounded-lg px-6 py-4 mb-10 mt-8">
        <div className="w-full flex-none text-lg text-slate-100 font-bold uppercase tracking-wider leading-none pt-2 pb-10">
          Clubs to join
        </div>

        {clubs.map((club, index) => {
          if (clubs.length !== index - 1)
            return (
              <div ref={lastRoomElementRef} key={club.id}>
                <ClubCard club={club} />
              </div>
            );
          else
            return (
              <div key={club.id}>
                <ClubCard club={club} />
              </div>
            );
        })}
        {loading && <Loader message="Loading Clubs..." size={36} />}
        {hasMore === false && (
          <div>
            <h1 className="text-center text-lg font-medium py-6 text-blue-800 text-opacity-40">
              No more Clubs : )
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default PeopleFollowCard;
