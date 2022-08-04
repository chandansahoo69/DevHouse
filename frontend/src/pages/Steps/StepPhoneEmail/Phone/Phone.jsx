import { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import { sendOtp } from "../../../../api/index";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";
import NotificationModal from "../../../../components/NotificationModal/NotificationModal";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [countryCode, setCountryCode] = useState("91");
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

  const dispatch = useDispatch();

  async function submit() {
    if (!phoneNumber) {
      NotificationHandler();
      return;
    }
    //server request
    try {
      const { data } = await sendOtp({
        phone: `+${countryCode + phoneNumber}`,
      });
      dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    } catch (error) {
      console.log("error:", error);
    }
    onNext();
  }

  return (
    <>
      <Card title="Enter you phone number" icon="phone">
        <div className="flex items-center gap-1">
          <PhoneInput
            country={"us"}
            value={countryCode}
            onChange={setCountryCode}
          />

          <TextInput
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Button text="Next" onClick={submit} />
          <p className="text-slate-300 text-base lg:text-lg md:text-lg">
            By entering your number, you're agreeing to our Terms of Serviec and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
      {showNotification && (
        <NotificationModal
          message={"Please Enter Phone No."}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default Phone;
