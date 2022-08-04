import { sendOtp } from "../../../api";

const sendOtpAgain = async ({ phone, email }) => {
  try {
    let wholeData = {
      hash: undefined,
      email: undefined,
      phone: undefined,
    };
    if (phone) {
      const { data } = await sendOtp({ phone });
      console.log(data);
      wholeData = { hash: data.hash, phone: data.phone, email: undefined };
    } else {
      const { data } = await sendOtp({ email });
      wholeData = { hash: data.hash, phone: undefined, email: data.email };
    }
    return wholeData;
  } catch (error) {
    console.log("sendOtp againg error", error);
  }
};

export default sendOtpAgain;
