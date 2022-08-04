import { MdWavingHand, MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillRobot } from "react-icons/ai";
import styles from "./Card.module.css";

const Card = ({ title, icon, children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.headingWrapper}>
        {icon === "wavehand" && (
          <MdWavingHand className="text-3xl" color="#ffdb00" />
        )}
        {icon === "phone" && (
          <FaPhoneAlt className="text-2xl" color="#5b893b" />
        )}
        {icon === "password" && (
          <RiLockPasswordFill className="text-2xl" color="#ff0000" />
        )}
        {icon === "name" && (
          <AiFillRobot className="text-2xl" color="#64ffda" />
        )}
        {icon === "email" && <MdEmail className="text-3xl" color="#ff0000" />}
        {title && (
          <h1 className="text-slate-100 lg:text-xl md:text-lg font-bold capitalize tracking-wider mx-2 antialiased">
            {title}
          </h1>
        )}
      </div>
      {children}
    </div>
  );
};

export default Card;
