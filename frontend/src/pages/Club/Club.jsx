import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleClub, joinClub } from "../../api";
import Loader from "../../components/shared/Loader/Loader";
import PeopleFollowCard from "../../components/shared/PeopleFollowCard/PeopleFollowCard";
import { CgNotes } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";
import AddClubModal from "../../components/AddClubModal/AddClubModal";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import RulesModal from "../../components/RulesModal/RulesModal";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import ProfileRoomCard from "../ProfilePage/ProfileRoomCard";

const Club = () => {
  const clubId = useParams();
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowMadal] = useState(false);
  const [showRulesModal, setShowRulesMadal] = useState(false);
  const [showRoomModal, setShowRoomMadal] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setLoading(true);
    const fetchClub = async () => {
      const club = await getSingleClub(clubId.id);
      setClubData(club.data);
      setLoading(false);
    };
    fetchClub();
  }, [clubId]);

  function showJoinOrLeaveTag() {
    const index = clubData.members.findIndex(
      (obj) => String(obj._id) === String(user.id)
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  function openModal() {
    setShowMadal(!showModal);
  }

  function openRulesModal() {
    setShowRulesMadal(!showRulesModal);
  }

  function matchUser() {
    return clubData.ownerId.id !== user.id;
  }

  function openRoomModal() {
    setShowRoomMadal(!showRoomModal);
  }

  const joinOrLeaveClub = async () => {
    const updatedClub = await joinClub(clubId.id);
    setClubData(updatedClub.data);
  };

  if (loading) return <Loader message="Loading Clubs..." />;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center containerBox bg-blue-300 bg-opacity-5 rounded-lg pt-6 pb-2 my-10">
          <section className="text-center mx-6 lg:w-2/3">
            <img
              className="m-auto rounded-2xl lg:w-96 w-96"
              src={clubData.image}
            />
            <h1 className="w-full flex-none text-2xl text-slate-10 font-bold capitalize leading-none py-4 px-6">
              {clubData.topic}
            </h1>
            <h1 className="font-semibold text-gray-500 text-lg">
              {clubData.members.length} Members
            </h1>
            <div className="flex items-center justify-center">
              {clubData && matchUser() && (
                <button
                  className="px-4 py-2 my-4 mx-2 bg-purple-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex justify-center items-center gap-3 hover:bg-purple-500 transition-all ease-in-out duration-500"
                  onClick={joinOrLeaveClub}
                >
                  {showJoinOrLeaveTag() === true ? (
                    <>
                      <RiLogoutCircleRLine className="text-2xl" />
                      <span className="hidden md:block lg:block">
                        Leave Club
                      </span>
                    </>
                  ) : (
                    <>
                      <IoMdPersonAdd className="text-2xl" />
                      <span className="hidden md:block lg:block">
                        Join Club
                      </span>
                    </>
                  )}
                </button>
              )}

              {!matchUser() && (
                <button
                  onClick={openModal}
                  className="px-4 py-2 my-4 mx-2 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
                >
                  <FiEdit className="text-2xl" />
                  <span className="hidden md:block lg:block">Edit Details</span>
                </button>
              )}

              <button
                onClick={openRulesModal}
                className="px-4 py-2 my-4 mx-2 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
              >
                <CgNotes className="text-2xl" />
                <span className="hidden md:block lg:block">View Rules</span>
              </button>
            </div>
          </section>

          <div className="containerBox pt-6 pb-2">
            <>
              <div className="flex justify-between items-center pb-2">
                <p className="font-bold text-slate-10 text-xl capitalize">
                  Up Next
                </p>
                {clubData.ownerId.name === user.name && (
                  <button
                    className="px-4 py-2 m-5 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
                    onClick={openRoomModal}
                  >
                    <FaUsers className="text-2xl" />
                    <span className="hidden md:block lg:block">
                      Start a room
                    </span>
                  </button>
                )}
              </div>

              <div
                className={`${
                  clubData.rooms.length !== 0
                    ? "h-auto"
                    : "h-40 flex items-center justify-center"
                } p-4 rounded-lg border-dashed border-2 border-slate-400`}
              >
                {clubData.rooms.length !== 0 ? (
                  <Splide
                    options={{
                      perPage:
                        width <= 450
                          ? 1
                          : width <= 540
                          ? 2
                          : width <= 768
                          ? 3
                          : 4,
                      waitForTransition: true,
                      drag: "free",
                      gap: "1rem",
                      pagination: true,
                      autoplay: true,
                    }}
                  >
                    {clubData.rooms.map((room, index) => (
                      <SplideSlide>
                        <ProfileRoomCard room={room} key={index} />
                      </SplideSlide>
                    ))}
                  </Splide>
                ) : (
                  <span className="text-sky_blue text-opacity-40 font-medium mx-auto text-xl capitalize">
                    No Events are avialble.
                  </span>
                )}
              </div>
            </>

            <div className="pt-10 pb-4">
              <p className="font-bold text-slate-10 text-xl">About</p>
              <div className="border-b-2 border-gray-400 border-opacity-30"></div>
              <p className="w-full flex-none text-sm text-white tracking-wide text-opacity-80 font-medium capitalize leading-none py-6">
                {clubData.about}
              </p>
              <p className="font-semibold text-slate-300 text-md">
                Founded By{" "}
                <span className="text-sky_blue">{clubData.ownerId.name}</span>
              </p>
            </div>
            <div className="w-full flex-none text-xl text-slate-10 font-bold capitalize py-4">
              Peoples
            </div>

            {clubData.members.map((people) => (
              <PeopleFollowCard people={people} key={people.id} />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <AddClubModal
          onClose={openModal}
          title="Edit the Club"
          type="edit"
          topic={clubData.topic}
        />
      )}
      {showRoomModal && <AddRoomModal onClose={openRoomModal} Url={"club"} />}
      {showRulesModal && (
        <RulesModal onClose={openRulesModal} rules={clubData.rules} />
      )}
    </>
  );
};

export default Club;
