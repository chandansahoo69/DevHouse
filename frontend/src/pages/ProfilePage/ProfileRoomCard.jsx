import { NavLink } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";

const ProfileRoomCard = ({ room }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 max-w-sm bg-lightest-navy rounded-lg shadow-lg hover:bg-light-navy ease-in-out transition-all duration-300">
        <h5 className="text-slate-100 text-lg font-mono font-bold tracking-wide">
          {room.topic}
        </h5>
        <button className="py-2 px-3 mt-6 text-slate-20 bg-indigo-700 bg-opacity-95 rounded-lg shadow-xs cursor-pointer hover:bg-indigo-300 hover:bg-opacity-30 hover:text-gray-100 transition-all ease-in-out duration-500">
          <NavLink
            to={`/room/${room._id}`}
            className="flex items-center justify-center"
          >
            <FaMicrophone color="#ff0000" />
            join room
          </NavLink>
        </button>
      </div>
    </>
  );
};

export default ProfileRoomCard;
