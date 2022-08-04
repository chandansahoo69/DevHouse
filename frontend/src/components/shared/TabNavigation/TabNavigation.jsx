import { NavLink } from "react-router-dom";
import { VscCommentDiscussion } from "react-icons/vsc";
import { IoPeopleSharp } from "react-icons/io5";
import { MdRadio } from "react-icons/md";

const TabNavigation = () => {
  return (
    <>
      <div className="containerBox flex flex-row items-center justify-center lg:justify-start pt-2 lg:pb-4 lg:py-8">
        <NavLink
          to={"rooms"}
          activeClassName="text-blue-600 border-b-2 border-blue-600 active"
          className={`flex gap-1 items-center py-4 px-4 text-md font-bold text-center text-slate-10 rounded-t-lg border-b-2 border-transparent uppercase`}
        >
          <VscCommentDiscussion className="text-2xl" />
          Rooms{"   "}
        </NavLink>
        <NavLink
          to={"clubs"}
          activeClassName="text-blue-600 border-b-2 border-blue-600 active"
          className={`flex gap-1 items-center py-4 px-4 text-md font-bold text-center text-slate-10 rounded-t-lg border-b-2 border-transparent uppercase`}
        >
          <MdRadio className="text-2xl" />
          Clubs{"   "}
        </NavLink>
        <NavLink
          to={"people"}
          activeClassName="text-blue-600 border-b-2 border-blue-600 active"
          className={`flex gap-1 items-center py-4 px-4 text-md font-bold text-center text-slate-10 rounded-t-lg border-b-2 border-transparent uppercase`}
        >
          <IoPeopleSharp className="text-2xl" />
          People{"   "}
        </NavLink>
      </div>
    </>
  );
};

export default TabNavigation;
