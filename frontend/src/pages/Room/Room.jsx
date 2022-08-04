import { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoomDetails } from "../../api";
import styles from "./Room.module.css";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import Loader from "../../components/shared/Loader/Loader";

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const history = useHistory();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);

  const handleManualLeave = () => {
    history.push("/rooms");
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      const { data } = await getRoomDetails(roomId);
      setRoom((prev) => data);
      setLoading(false);
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleMuteClick = (clientId) => {
    //we can only change our mic so if the current user if not matches with the given client id then
    //we can't mute other peoples
    if (clientId !== user.id) return;
    //toggle the value
    setIsMute((isMute) => !isMute);
  };

  if (loading) return <Loader message="Joining the room..." />;

  return (
    <div className="containerBox shadow-lg">
      <button
        className="flex items-center bg-none outline-none border-none mt-4 cursor-pointer font-bold rounded-md py-2 px-4 hover:bg-lightest-navy text-slate-50 transition-all ease-in-out duration-300"
        onClick={handleManualLeave}
      >
        <img src="/image/arrow-left.png" alt="arrow-left" />
        <span className=" ml-4">All Voice Rooms</span>
      </button>

      <div className={`bg-blue-300 bg-opacity-5 p-10 rounded-lg my-10`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-xl lg:text-2xl uppercase text-yellow-300">
            {room?.topic}
          </h2>
          <div className="flex items-center">
            <button
              onClick={handleManualLeave}
              className={`py-2 px-4 outline-none border-none flex items-center font-semibold shadow-md rounded-lg text-slate-50 ease-in-out transition-all duration-300 bg-lightest-navy hover:bg-light-navy`}
            >
              <img src="/image/win.png" alt="win-icon" />
              <span className="pl-1 lg:font-normal">Leave quietly</span>
            </button>
          </div>
        </div>
        <div
          className={`mt-14 mb-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2`}
        >
          {clients.map((client) => {
            return (
              <div className={styles.client} key={client.id}>
                <div className={styles.userHead}>
                  <audio
                    ref={(instance) => provideRef(instance, client.id)}
                    autoPlay
                  ></audio>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt="avatar"
                  />

                  <button
                    className={styles.micBtn}
                    onClick={() => handleMuteClick(client.id)}
                  >
                    {client.muted ? (
                      <BsMicMuteFill size={20} />
                    ) : (
                      <BsMicFill size={20} color={"red"} />
                    )}
                  </button>
                </div>
                <h4 className="text-slate-200 font-normal capitalize text-center">
                  {client.name}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
