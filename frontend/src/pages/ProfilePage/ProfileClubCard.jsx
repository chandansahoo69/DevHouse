import { NavLink } from "react-router-dom";

const ProfileClubCard = ({ club }) => {
  return (
    <>
      <NavLink to={`/club/${club.id}`}>
        <div
          className={`flex flex-col items-center bg-profile_club_div mx-2 shadow-lg rounded-md lg:px-2 py-4`}
        >
          <img
            className="mb-3 lg:w-5/6 w-4/6 lg:h-32 h-24 rounded-lg shadow-lg"
            src={club.image}
            alt="Bonnie image"
          />
          <div className="px-6">
            <h5 className="text-slate-100 text-lg font-mono font-bold tracking-wide">
              {club.topic}
            </h5>
            {/* <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {club.about}
              </span> */}
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default ProfileClubCard;
