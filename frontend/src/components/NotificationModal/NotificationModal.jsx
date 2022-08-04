import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotificationModal = ({ message, onClick }) => {
  return (
    <>
      <div className="flex flex-col p-2 pr-4  bg-gray-800 bg shadow-md hover:shodow-lg rounded-2xl absolute bottom-10 right-10 z-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 rounded-2xl p-3 border border-gray-800 text-blue-400 bg-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="flex flex-col ml-3">
              <div className="font-medium leading-none text-gray-100">
                {message}
              </div>
              {/* <p className="text-sm text-gray-500 leading-none mt-1">
                By deleting your account you will lose your all data
              </p> */}
            </div>
          </div>
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer text-gray-400 hover:text-gray-100 rounded-md text-sm ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
            onClick={onClick}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
