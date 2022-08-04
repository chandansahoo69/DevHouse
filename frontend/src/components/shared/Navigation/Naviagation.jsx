import { Link } from "react-router-dom";
import { logout } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { IoLogOutOutline } from "react-icons/io5";

const Naviagation = () => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  let userId;
  if (user) {
    userId = user.id;
  } else {
    userId = null;
  }

  async function logoutUser() {
    try {
      //get the empty data from database
      const { data } = await logout();
      //set it to the store
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <nav className={`flex items-center justify-between py-6 containerBox`}>
        <Link
          to="/"
          className="font-bold flex items-center text-white lg:text-2xl md:text-xl sm:text-xl"
        >
          <img src="/image/logo.png" alt="logo" />
          <span className="ml-3">Devhouse</span>
        </Link>
        {isAuth && (
          <div className="flex items-center justify-center gap-2">
            {/* {user.name && <h3>{user.name}</h3>} */}

            {user && (
              <Link to={`/user/${userId}`}>
                <img
                  className="w-12 h-12 object-cover rounded-full border-2 border-indigo-500"
                  src={user.avatar}
                  alt="user_avatar"
                />
              </Link>
            )}

            <button
              className="flex items-center justify-center gap-2 py-2 px-4 text-slate-20 bg-indigo-700 bg-opacity-30 rounded-lg shadow-xs cursor-pointer hover:bg-indigo-300 hover:bg-opacity-30 hover:text-gray-100 transition-all ease-in-out duration-500"
              onClick={logoutUser}
            >
              <p className="text-md font-semibold hidden lg:block md:block">
                Logout
              </p>
              <IoLogOutOutline size={22} className="font-bolder" />
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Naviagation;
