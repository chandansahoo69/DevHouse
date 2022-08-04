import React from "react";
import { NavLink } from "react-router-dom";

const PeopleFollowCard = ({ people }) => {
  return (
    <>
      <NavLink to={`/user/${people._id}`}>
        <div className="p-4 my-2 w-full text-slate-300 bg-light-navy rounded-xl shadow dark:bg-gray-800 dark:text-gray-300">
          <div className="flex items-center">
            <div className="inline-block relative shrink-0">
              <img
                className="w-12 h-12 rounded-full"
                src={people.avatar}
                alt="people_avatar"
              />
              <span className="inline-flex absolute right-0 bottom-0 justify-center items-center w-6 h-6 bg-blue-600 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="ml-3 text-sm font-normal">
              <h4 className="text-sm font-semibold text-slate-50 dark:text-white">
                {people.name}
              </h4>
              {/* <div className="text-sm font-normal">
                    commmented on your photo
                  </div> */}
              {/* <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
                    a few seconds ago
                  </span> */}
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default PeopleFollowCard;
