import { useState } from "react";
import { createRoom as create, createRoomInClub } from "../../api";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Button from "../shared/Button/Button";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationModal from "../NotificationModal/NotificationModal";

const AddRoomModal = ({ onClose, Url }) => {
  const { id: clubId } = useParams();
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");
  const history = useHistory();
  const [showNotification, setShowNotification] = useState(false);

  const closeNotification = () => {
    setShowNotification(false);
  };

  // off the notification
  const NotificationHandler = () => {
    setShowNotification(true);
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowNotification(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  };

  async function createRoom() {
    try {
      //user not selected any topic
      if (!topic) {
        NotificationHandler();
        return;
      }
      if (Url === "room") {
        const { data } = await create({ topic, roomType });
        history.push(`/room/${data.id}`);
        //room/sfsadfdsfadsfdsafdsa
      } else {
        const clubRoomData = { clubId, topic, roomType };
        const { data } = await createRoomInClub(clubRoomData);
        onClose();
        history.push(history.location.pathname + `/room/${data.room._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="min-w-screen h-screen animated fadeIn faster fixed -left-1 -top-1 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
          <div className="flex flex-col justify-center items-center relative">
            <div className="text-center p-5 flex flex-col justify-center items-center">
              <button
                onClick={onClose}
                className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-lightest-navy hover:text-gray-100 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div className="flex justify-center items-center gap-3 pb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-calendar2-week text-red-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                  <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                </svg>
                <h2 className="text-xl font-bold capitalize">
                  Let's Start a room
                </h2>
              </div>
              <input
                value={topic}
                className="my-4 w-full text-md text-white bg-gray-700 bg-opacity-40 rounded-lg px-4 py-2 focus:outline-none"
                placeholder="Enter the topic to be disscussed"
                onChange={(e) => setTopic(e.target.value)}
              />
              <h2 className="text-xl font-bold pt-7 pb-4">Room types</h2>
              <div className="grid grid-cols-3 gap-8">
                <div
                  onClick={() => setRoomType("open")}
                  className={`bg-transparent py-2 px-4 rounded-lg ${
                    roomType === "open" ? "bg-lightest-navy font-bold" : ""
                  }`}
                >
                  <img src="/image/globe.png" alt="globe" />
                  <span>Open</span>
                </div>
                <div
                  onClick={() => setRoomType("social")}
                  className={`bg-transparent py-2 px-4 rounded-lg ${
                    roomType === "social" ? "bg-lightest-navy font-bold" : ""
                  }`}
                >
                  <img src="/image/social.png" alt="social" />
                  <span>Social</span>
                </div>
                <div
                  onClick={() => setRoomType("private")}
                  className={`bg-transparent py-2 px-4 rounded-lg ${
                    roomType === "private" ? "bg-lightest-navy font-bold" : ""
                  }`}
                >
                  <img src="/image/lock.png" alt="lock" />
                  <span>Private</span>
                </div>
              </div>
            </div>
            <Button onClick={createRoom} text="Let's Go" />
          </div>
        </div>
      </div>
      {showNotification && (
        <NotificationModal
          message={"Please Enter a Room Topic."}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default AddRoomModal;
