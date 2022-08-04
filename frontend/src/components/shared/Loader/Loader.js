const Loader = ({ message, size }) => {
  let circleCommonClasses = "h-2.5 w-2.5 bg-current rounded-full";

  return (
    <div className="cardWrapper containerBox z-50">
      <div
        className={`flex flex-col justify-center items-center shadow-lg shadow-purple-200 p-4 w-full md:w-96 sm:w-3/6 h-${
          size ? size : 52
        } rounded-2xl bg-blue-200 bg-opacity-5 max-w-[24rem]`}
      >
        <div className="flex">
          <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
          <div
            className={`${circleCommonClasses} mr-1 animate-bounce200`}
          ></div>
          <div className={`${circleCommonClasses} animate-bounce400`}></div>
        </div>

        <span className="antialiased font-mono text-sky-400/100 tracking-normal py-4">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Loader;
