import { useState } from "react";
import Email from "./Email/Email";
import Phone from "./Phone/Phone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

//map for toggling component
const phoneEmailMap = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({ onNext }) => {
  const [type, setType] = useState("phone");
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-8 flex justify-end gap-5">
          <button
            className={`p-4 ${
              type === "phone"
                ? "bg-blue-900 bg-opacity-30 text-sky_blue shadow-md p-4 rounded-xl"
                : ""
            }`}
            onClick={() => setType("phone")}
          >
            <FontAwesomeIcon icon={faPhoneAlt} size="2x" />
          </button>
          <button
            className={`p-4 ${
              type === "email"
                ? "bg-blue-900 bg-opacity-30 text-sky_blue shadow-md p-4 rounded-xl"
                : ""
            }`}
            onClick={() => setType("email")}
          >
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </button>
        </div>

        {/* show the clicked component */}
        <Component onNext={onNext} />
      </div>
    </>
  );
};

export default StepPhoneEmail;
