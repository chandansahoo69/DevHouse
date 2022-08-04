import styles from "./ClubRoomCard.module.css";
import { NavLink } from "react-router-dom";

const ClubRoomCard = ({ room, clubId, user }) => {
  return (
    <NavLink to={`/club/${clubId}/room/${room._id}`}>
      <div className={`${styles.card} mx-2`}>
        <h3 className="text-lg font-mono font-bold tracking-wide">
          {room.topic}
        </h3>
        <div
          className={`${styles.speakers} ${
            room.speakers && room.speakers.length === 1
              ? styles.singleSpeaker
              : ""
          }`}
        >
          <div className={styles.avatars}>
            {room.speakers &&
              room.speakers.map((speaker) => (
                <img key={speaker.id} src={user.avatar} alt="speaker-avatar" />
              ))}
          </div>
          <div className={styles.names}>
            {room.speakers &&
              room.speakers.map((speaker) => (
                <div key={speaker.id} className={styles.nameWrapper}>
                  <span>{speaker.name}</span>
                  <img src="/image/chat-bubble.png" alt="chat-bubble" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ClubRoomCard;
