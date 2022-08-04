import { useRef, useState, useCallback } from "react";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import RoomCard from "../../components/RoomCards/RoomCard";
import Loader from "../../components/shared/Loader/Loader";
import useFetchData from "../../hooks/useFetchData";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const Rooms = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowMadal] = useState(false);
  const { rooms, loading, hasMore } = useFetchData(query, pageNumber, "rooms");

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

  function openModal() {
    setShowMadal(!showModal);
  }

  return (
    <>
      <div className="containerBox">
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center">
            <div className="flex items-center justify-center px-4 rounded-full bg-light-navy max-w-lg ml-4">
              <BiSearchAlt2 className="text-2xl" />
              <input
                type="text"
                placeholder="Search a room"
                className="bg-transparent border-none outline-none p-2 w-full text-white"
              />
            </div>
          </div>
          <div>
            <button
              className="px-4 py-2 m-5 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
              onClick={openModal}
            >
              <FaUsers className="text-2xl" />
              <span className="hidden md:block lg:block">Start a room</span>
            </button>
          </div>
        </div>

        <div className="bg-blue-300 bg-opacity-5 rounded-lg p-6 mt-2 lg:mt-10 mb-10 shadow-md">
          <div className="w-full flex-none text-lg text-slate-100 font-bold uppercase leading-none pt-2 pb-10">
            Rooms to join
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room, index) => {
              if (rooms.length >= index - 3)
                return (
                  <div ref={lastRoomElementRef} key={room.id}>
                    <RoomCard room={room} />
                  </div>
                );
              else
                return (
                  <div key={room.id}>
                    <RoomCard room={room} />
                  </div>
                );
            })}
          </div>

          {loading && <Loader message="Loading Room..." size={36} />}
          {hasMore === false && (
            <div>
              <h1 className="text-center text-lg font-medium py-6 text-blue-800 text-opacity-40">
                No more Rooms : )
              </h1>
            </div>
          )}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={openModal} Url={"room"} />}
    </>
  );
};

export default Rooms;
