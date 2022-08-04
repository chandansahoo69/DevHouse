const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  try {
    //get the access token from cookies
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }
    //verify the token and get the user data
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new Error();
    }
    //make a key on request to verify in controller
    req.user = userData;
    //if every thing is ok then go to the next step
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token." });
  }
};
