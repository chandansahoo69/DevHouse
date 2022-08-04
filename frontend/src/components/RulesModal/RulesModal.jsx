import { FaTimes } from "react-icons/fa";
import { FcRules } from "react-icons/fc";

const RulesModal = ({ onClose, rules }) => {
  return (
    <>
      <div className="min-w-screen h-screen animated fadeIn faster fixed -left-1 -top-1 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
          <div className="flex flex-col justify-center items-center relative">
            <div className="text-center p-5 flex flex-col justify-center items-center">
              <button
                onClick={onClose}
                className="absolute top-1 right-1 text-slate-100 bg-transparent hover:bg-lightest-navy hover:text-gray-100 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
              >
                <FaTimes className="text-xl" />
              </button>
              <div className="flex justify-center items-center gap-3 pb-10">
                <FcRules className="text-2xl" />
                <h2 className="text-xl font-bold capitalize">
                  Rules of the club
                </h2>
              </div>
              <span className="text-sky_blue text-lg">{rules}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RulesModal;
