const router = require("express").Router();
const activateController = require("../controller/activate-controller");
const authController = require("../controller/auth-controller");
const clubController = require("../controller/club-controller");
const roomsController = require("../controller/rooms-controller");
const userController = require("../controller/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/activate", authMiddleware, activateController.activate);
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authMiddleware, authController.logout);
router.post("/api/rooms", authMiddleware, roomsController.create);
router.get("/api/rooms", authMiddleware, roomsController.index);
router.get("/api/peoples", authMiddleware, userController.getAllUsers);
router.get(
  "/api/rooms/:roomId",
  authMiddleware,
  roomsController.showRoomDetails
);
router.get("/api/user/:id", authMiddleware, userController.findSingleUser);
router.get("/api/clubs", authMiddleware, clubController.getAllClubs);

router.post(
  "/api/club/:clubId/createRoom",
  authMiddleware,
  clubController.createRoomInClub
);

router.put(
  "/api/user/:id/followUser",
  authMiddleware,
  userController.FollowUnfollowUser
);

router.post(
  "/api/user/:id/createClub",
  authMiddleware,
  clubController.createClub
);
router.put(
  "/api/club/:id/updateClub",
  authMiddleware,
  clubController.updateClub
);
router.get("/api/club/:clubId", authMiddleware, clubController.showClubDetails);
router.put(
  "/api/club/:clubId/joinClub",
  authMiddleware,
  clubController.joinClub
);
router.get(
  "/api/user/:userId/getAllFollowers",
  authMiddleware,
  userController.getAllFollowers
);
router.get(
  "/api/user/:userId/getAllFollowing",
  authMiddleware,
  userController.getAllFollowing
);

module.exports = router;
