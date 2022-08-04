import styles from "./RoomCard.module.css";
import { useHistory } from "react-router-dom";

const RoomCard = ({ room }) => {
  const history = useHistory();

  return (
    <div
      onClick={() => {
        history.push(`/room/${room.id}`);
      }}
      className={styles.card}
    >
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
              <img key={speaker.id} src={speaker.avatar} alt="speaker-avatar" />
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
  );
};

export default RoomCard;
