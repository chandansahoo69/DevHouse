import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { followUser, getSingleUser } from "../../api";
import Loader from "../../components/shared/Loader/Loader";
import { BsCalendar2Event, BsCalendarCheck } from "react-icons/bs";
import AddClubModal from "../../components/AddClubModal/AddClubModal";
import ProfileClubCard from "./ProfileClubCard";
import { NavLink } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ProfileRoomCard from "./ProfileRoomCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";

const Profile = () => {
  const { width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const userId = location.pathname.substr(6);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowMadal] = useState(false);
  const [showRoomModal, setShowRoomMadal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const user = await getSingleUser(userId);
      setUserData(user.data);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  function openModal() {
    setShowMadal(!showModal);
  }

  function openRoomModal() {
    setShowRoomMadal(!showRoomModal);
  }

  const followOrUnfollowUser = async () => {
    const user = await followUser(userId);
    setUserData(user.data);
  };

  function showFollowUnfollowTag() {
    const index = userData.followers.findIndex(
      (obj) => String(obj._id) === String(user.id)
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  function matchUser() {
    return user && userId !== user.id;
  }
  if (loading) return <Loader message="Loading Profile..." />;

  return (
    <>
      <div className="containerBox rounded-lg shadow w-auto text-gray-600 mb-5 bg-blue-300 bg-opacity-5 py-16">
        <div className="flex flex-row items-center justify-center">
          <div>
            <div className="flex flex-col gap-1 text-center">
              <img
                data="picture"
                className="h-20 w-20 border-blue-600 border-4 rounded-full shadow-md block mx-auto bg-center bg-no-repeat bg-cover"
                src={userData ? userData.avatar : ""}
                alt="user_avatar"
              />
              <p className="role font-semibold text-xxs text-blue-600 px-1 rounded shadow-md">
                {userData ? userData.name : ""}
              </p>
            </div>

            <div className="flex justify-center items-center gap-2 my-3">
              <div className="font-semibold text-center mx-2 lg:mx-4">
                <p className="text-blue-600 font-bold">
                  {userData.clubs.length}
                </p>
                <span className="text-gray-400">Clubs</span>
              </div>
              <NavLink
                to={`/user/${userId}/getAllFollowers`}
                className="font-semibold text-center mx-2 lg:mx-4 bg-transparent py-2 px-4 rounded-lg hover:bg-lightest-navy"
              >
                <p className="text-blue-600 font-bold">
                  {userData && userData.followers.length}
                </p>
                <span className="text-gray-400">Followers</span>
              </NavLink>
              <NavLink
                to={`/user/${userId}/getAllFollowing`}
                className="font-semibold text-center mx-2 lg:mx-4 bg-transparent py-2 px-4 rounded-lg hover:bg-lightest-navy"
              >
                <p className="text-blue-600 font-bold">
                  {userData && userData.following.length}
                </p>
                <span className="text-gray-400">Folowing</span>
              </NavLink>
            </div>

            <div className="flex justify-center gap-2 my-5">
              {userData && matchUser() && (
                <div
                  onClick={followOrUnfollowUser}
                  className="text-sm font-bold text-gray-50 btn px-4 py-2 mr-1 rounded-full shadow cursor-pointer bg-blue-600 hover:bg-gray-300"
                >
                  {showFollowUnfollowTag() === true ? "UNFOLLOW" : "FOLLOW"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="containerBox flex flex-col items-center">
          <div className="flex items-center justify-between pl-3 pr-1">
            <h1 className="inline-block py-2 px-4 text-md font-bold text-center text-gray-400 rounded-t-lg border-b-2 border-transparent uppercase">
              Clubs
            </h1>
            {!matchUser() && (
              <button
                className="px-4 py-2 m-5 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
                onClick={openModal}
              >
                <BsCalendar2Event />
                <span className="hidden md:block lg:block">Create a Club</span>
              </button>
            )}
          </div>
          <div className="w-5/6 border-b border-slate-100"></div>
          {userData.rooms.length !== 0 ? (
            <div className="flex flex-col mt-4 container max-w-7xl px-4">
              <Splide
                options={{
                  perPage:
                    width <= 450 ? 1 : width <= 540 ? 2 : width <= 768 ? 3 : 4,
                  waitForTransition: true,
                  drag: "free",
                  gap: "1rem",
                  pagination: false,
                  autoplay: true,
                }}
              >
                {userData.clubs.map((club, index) => (
                  <SplideSlide>
                    <ProfileClubCard club={club} key={index} />
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          ) : (
            <span className="text-sky_blue text-opacity-40 font-medium text-lg capitalize pt-4">
              No Clubs are avialble.
            </span>
          )}
        </div>
        <div className="containerBox flex flex-col items-center">
          <div className="flex items-center justify-between pl-3 pr-1">
            <h1 className="inline-block py-2 px-4 text-md font-bold text-center text-gray-400 rounded-t-lg border-b-2 border-transparent uppercase">
              Rooms
            </h1>
            {!matchUser() && (
              <button
                className="px-4 py-2 m-5 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
                onClick={openRoomModal}
              >
                <BsCalendarCheck />
                <span className="hidden md:block lg:block">Create a Room</span>
              </button>
            )}
          </div>

          <div className="w-5/6 border-b border-slate-100"></div>

          {userData.rooms.length !== 0 ? (
            <div className="flex flex-col mt-4 container max-w-7xl px-4">
              <Splide
                options={{
                  perPage:
                    width <= 450 ? 1 : width <= 540 ? 2 : width <= 768 ? 3 : 4,
                  waitForTransition: true,
                  drag: "free",
                  gap: "1rem",
                  pagination: false,
                  autoplay: true,
                }}
              >
                {userData.rooms.map((room, index) => (
                  <SplideSlide>
                    <ProfileRoomCard room={room} key={index} />
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          ) : (
            <span className="text-sky_blue text-opacity-40 font-medium text-lg capitalize pt-4">
              No Rooms are avialble.
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <AddClubModal
          onClose={openModal}
          title="Create a Club, open to Everyone"
          type="create"
        />
      )}

      {showRoomModal && <AddRoomModal onClose={openRoomModal} Url={"room"} />}
    </>
  );
};

export default Profile;
