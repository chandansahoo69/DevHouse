import { useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Card from "../../../../components/shared/Card/Card";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";
import { sendOtp } from "../../../../api";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import NotificationModal from "../../../../components/NotificationModal/NotificationModal";

const Email = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();

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

  async function submit() {
    if (!email) {
      NotificationHandler();
      return;
    }
    //server request
    try {
      const { data } = await sendOtp({ email });
      dispatch(setOtp({ email: data.email, hash: data.hash }));
    } catch (error) {
      console.log("error:", error);
    }
    onNext();
  }

  return (
    <>
      <Card title="Enter you email id" icon="email">
        <div>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex flex-col items-center justify-center">
            <Button text="Next" onClick={submit} />
            <p className="text-slate-300 text-base lg:text-lg md:text-lg">
              By entering your email, you're agreeing to our Terms of Serviec
              and Privacy Policy. Thanks!
            </p>
          </div>
        </div>
      </Card>
      {showNotification && (
        <NotificationModal
          message={"Please Enter Email"}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default Email;
