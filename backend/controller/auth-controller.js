const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const mailService = require("../services/email-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    console.log("enter");
    //get the phone no
    const { phone, email } = req.body;

    //if phone no is not given
    if (!phone && !email) {
      //400 is client error
      res.status(400).json({ message: "Phone field is required!" });
    }

    //generate an otp
    const otp = await otpService.generateOtp();

    const phoneOrEmail = !phone ? email : phone;

    //hash the otp
    const ttl = 1000 * 60 * 2; //expire in 2 min
    const expires = Date.now() + ttl; //expire time
    const data = `${phoneOrEmail}.${otp}.${expires}`; //data to be hashed
    //why we hash the expire tine because if someone change the
    //expire in console then he can login in the app. to prevent
    //we also hash the expire and when we hash the value with expire time
    //it generate a unique value, but if someone change the value
    //it will not match with the generated value🤐.
    const hash = hashService.hashOtp(data);

    //send the original otp to the user not the hashed one
    try {
      if (phone) {
        console.log(phone, otp);
        // await otpService.sendBySms(phone, otp);
        res.json({
          hash: `${hash}.${expires}`, //why send expire time bcz to verify the the expire time during verification of otp
          phone,
        });
      } else {
        console.log(otp);
        // await mailService.sendMail(email, otp);
        res.json({
          hash: `${hash}.${expires}`,
          email,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "message sending failed." });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone, email } = req.body;
    //to verify the data are coming from frontend or not
    if (!otp || !hash || (!phone && !email)) {
      res.status(400).json({ message: "All fields are required." });
    }

    const [hashedOtp, expires] = hash.split(".");

    const phoneOrEmail = !phone ? email : phone;

    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired." });
    }

    const data = `${phoneOrEmail}.${otp}.${expires}`;
    //send the hashed otp and the user entered otp and phone no to check validity
    const isValid = otpService.verifyOtp(hashedOtp, data);

    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
    }

    let user;
    let activated = false;
    //create a user
    try {
      if (phone) {
        user = await userService.findUser({ phone });
        //if user in that phone number is not present then create a user
        if (!user) {
          user = await userService.createUser({ phone, activated });
        }
      } else {
        user = await userService.findUser({ email });
        //if user in that phone number is not present then create a user
        if (!user) {
          user = await userService.createUser({ email, activated });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "DB error." });
    }

    //jwt token
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });
    //store the refreshTOken in database
    await tokenService.storeRefreshToken(refreshToken, user._id);

    //set the cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true, //security purpose
    });

    //set the cookie for access token
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true, //security purpose
    });

    //modify the user response
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async refresh(req, res) {
    // get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    // check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // Check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    // check if valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    // Generate new tokens
    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    // Update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    // put in cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    // response
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    //delete refresh token from db
    await tokenService.removeToken(refreshToken);
    //delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    //send the empty response
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
