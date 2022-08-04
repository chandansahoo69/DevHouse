import { BiRightArrowAlt } from "react-icons/bi";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 my-4 mx-2 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-900 transition-all ease-in-out duration-500"
    >
      <span className="font-bold">{text}</span>
      <BiRightArrowAlt className="text-2xl" />
    </button>
  );
};
export default Button;
