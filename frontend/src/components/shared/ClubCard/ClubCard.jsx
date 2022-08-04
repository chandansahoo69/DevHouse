import { NavLink } from "react-router-dom";

const ClubCard = ({ club }) => {
  return (
    <>
      <NavLink to={`/club/${club.id}`}>
        <div className="max-w-8xl w-full mx-auto z-10">
          <div className="bg-gray-800 border border-gray-800 shadow-lg rounded-3xl p-4 m-4">
            <div className="flex items-center justify-between">
              <div className="flex-row sm:flex">
                <div className="relative h-20 w-24 sm:mb-0 mb-3">
                  <img
                    src={club.image}
                    alt="people_avatar"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex-auto sm:ml-5 justify-evenly">
                  <div className="flex items-center justify-between sm:mt-2">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="w-full flex-none text-lg text-gray-200 uppercase font-semibold leading-none">
                          {club.topic}
                        </div>
                        <div className="flex-auto text-gray-400 my-1">
                          <span className="mr-3 ">{club.about}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default ClubCard;
