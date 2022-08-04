import { useState } from "react";
import Button from "../shared/Button/Button";
import { createClub, updateClub } from "../../api";
import { useHistory, useParams } from "react-router-dom";
import NotificationModal from "../NotificationModal/NotificationModal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddClubModal = ({ onClose, title, type, topic: clubTopic }) => {
  const { id: userId } = useParams();
  const [topic, setTopic] = useState("");
  const [rules, setRules] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();
  const [image, setImage] = useState("/image/monkey-avatar.png");
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationMessage, setShowNotificationMessage] = useState("");

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
    };
  }

  const closeNotification = () => {
    setShowNotification(false);
  };

  // off the notification
  const NotificationHandler = () => {
    setShowNotification(true);
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowNotification(false);
    }, 9000);

    return () => {
      clearTimeout(timeId);
    };
  };

  async function createRoom(e) {
    e.preventDefault();
    try {
      //user not selected any topic
      if (!topic) {
        setShowNotificationMessage("Please Select a Club Topic.");
        NotificationHandler();
        return;
      }
      if (image === "/image/monkey-avatar.png") {
        setShowNotificationMessage("Please Select a Club Image.");
        NotificationHandler();
        return;
      }

      const clubDetails = {
        userId,
        topic,
        image,
        rules,
        description,
      };

      const { data } = await createClub(clubDetails);
      //go to this route -> club/sfsadfdsfadsfdsafdsa
      history.push(`/club/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async function editRoom(e) {
    e.preventDefault();
    try {
      //user not selected any topic
      if (image === "/image/monkey-avatar.png") {
        setShowNotificationMessage("Please Select a Club Image.");
        NotificationHandler();
        return;
      }

      const clubId = userId;
      const clubDetails = {
        clubId,
        topic: clubTopic,
        image,
        rules,
        description,
      };
      const { data } = await updateClub(clubDetails);
      onClose();
      history.push(`/club/${data.id}`);
      //go to this route -> club/sfsadfdsfadsfdsafdsa
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-w-screen">
        <div className="w-full h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
            <div className="flex flex-col justify-center items-center relative">
              <div className="text-center flex flex-col justify-center items-center">
                <button
                  onClick={onClose}
                  className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-lightest-navy hover:text-gray-100 rounded-md text-sm p-1.5 ml-auto inline-flex items-center ease-in-out transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="flex justify-center items-center gap-3">
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
                  <h2 className="text-xl font-bold capitalize">{title}</h2>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col justify-center items-center py-6">
                  <div className="h-14 w-24 mb-10">
                    <img
                      src={image}
                      alt="club_avatar"
                      className="w-24 h-24 rounded-2xl"
                    />
                  </div>
                  <div>
                    <input
                      onChange={captureImage}
                      id="avatarInput"
                      type="file"
                      className="hidden"
                    />
                    <label
                      htmlFor="avatarInput"
                      className="cursor-pointer hover:text-blue-500"
                    >
                      Choose a different photo
                    </label>
                  </div>
                </div>

                {type === "create" && (
                  <div>
                    <input
                      value={topic}
                      className="w-full text-md text-white bg-gray-700 bg-opacity-40 rounded-lg px-4 py-2 focus:outline-none"
                      placeholder="Club Name"
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    <span className="px-2 font-medium text-red-500 text-xs">
                      *Required, can't be changed later
                    </span>
                  </div>
                )}

                <input
                  value={rules}
                  className="my-4 w-full text-md text-white bg-gray-700 bg-opacity-40 rounded-lg px-4 py-2 focus:outline-none"
                  placeholder="Rules"
                  onChange={(e) => setRules(e.target.value)}
                />

                <div className="relative w-full appearance-none label-floating">
                  <textarea
                    value={description}
                    className="autoexpand tracking-wide py-2 px-4 mb-2 leading-relaxed appearance-none block w-full bg-gray-700 bg-opacity-40 rounded-lg focus:outline-none"
                    id="message"
                    type="text"
                    rows="3"
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute tracking-wide py-2 px-4 mb-4 opacity-0 leading-tight block top-0 left-0 cursor-text"
                  >
                    Message...
                  </label>
                </div>
              </div>
              <Button
                onClick={type === "create" ? createRoom : editRoom}
                text={type === "create" ? `Let's Go` : "Update"}
              />
            </div>
          </div>
        </div>
      </div>
      {showNotification && (
        <NotificationModal
          message={showNotificationMessage}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default AddClubModal;
