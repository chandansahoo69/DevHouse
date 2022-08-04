const clubService = require("../services/club-service");
const ClubDto = require("../dtos/club-dto");
const Jimp = require("jimp");
const path = require("path");
const userModel = require("../models/user-model");
const clubModel = require("../models/club-model");
const userService = require("../services/user-service");
const roomService = require("../services/room-service");

class ClubController {
  async createClub(req, res) {
    const { userId, image: clubImage, topic, description, rules } = req.body;

    // Image Base64
    const buffer = Buffer.from(
      clubImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    // 32478362874-3242342342343432.png

    try {
      //covert the image to small size
      const jimResp = await Jimp.read(buffer);
      //store it in storage folder
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/club/${imagePath}`));
    } catch (err) {
      res.status(500).json({ message: "Could not process the image" });
    }

    try {
      const club = await clubService.createClub({
        image: `/storage/club/${imagePath}`,
        topic,
        about: description,
        rules,
        ownerId: userId,
      });

      //update the club in user's club array
      const user = await userModel.findOne({ _id: userId });
      user.clubs.push(club._id);
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        user,
        {
          new: true,
        }
      );

      return res.json(new ClubDto(club));
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async getAllClubs(req, res) {
    const page = req.query.page || 1;
    const clubs = await clubService.findAllClubs(page);
    return res.json(clubs);
  }

  async showClubDetails(req, res) {
    const club = await clubService.getClubDetails(req.params.clubId);
    return res.json(club);
  }

  async joinClub(req, res) {
    //get the clubId
    const { clubId } = req.params;
    // get the userId
    const userId = req.user._id;
    if (!userId) {
      return res.json({ message: "Unauthenticated" });
    }

    try {
      //get the room and user
      const club = await clubService.getClubDetails(clubId);
      const user = await userService.findUser({ _id: userId });
      //find if user is there or not
      const index = club.members.findIndex(
        (obj) => String(obj._id) === String(userId)
      );

      if (index === -1) {
        //user is not inside club so join the club
        club.members.push(userId);
        //add the club in current user club array
        user.clubs.push(clubId);
      } else {
        //if user is already there now leave the user from this room
        club.members = club.members.filter(
          (obj) => String(obj._id) !== String(userId)
        );

        //if club is already there now remove the club from the array
        user.clubs = user.clubs.filter(
          (obj) => String(obj._id) !== String(clubId)
        );
      }
      const updatedClub = await clubModel
        .findByIdAndUpdate({ _id: clubId }, club, {
          new: true,
        })
        .populate(["members"])
        .exec();

      //update the user as it join or leave the club
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        user,
        {
          new: true,
        }
      );

      return res.json(new ClubDto(updatedClub));
    } catch (error) {
      console.log("joining room error", error);
    }
  }

  async updateClub(req, res) {
    try {
      const userId = req.user._id;
      const { clubId, topic, image: clubImage, rules, description } = req.body;

      // Image Base64
      const buffer = Buffer.from(
        clubImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      // 32478362874-3242342342343432.png

      try {
        //covert the image to small size
        const jimResp = await Jimp.read(buffer);
        //store it in storage folder
        jimResp
          .resize(150, Jimp.AUTO)
          .write(path.resolve(__dirname, `../storage/club/${imagePath}`));
      } catch (err) {
        res.status(500).json({ message: "Could not process the image" });
      }

      try {
        const clubDetails = {
          image: `/storage/club/${imagePath}`,
          topic,
          about: description,
          rules,
          ownerId: userId,
        };

        const updatedClub = await clubModel.findByIdAndUpdate(
          clubId,
          {
            $set: clubDetails,
          },
          { new: true }
        );
        return res.json(new ClubDto(updatedClub));
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
    } catch (error) {
      //internal server error 500
      console.log("club error ", error);
      res.status(500).json(error);
    }
  }

  async createRoomInClub(req, res) {
    //get the clubId
    const { clubId } = req.params;
    let club = await clubService.getClubDetails(clubId);

    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!!!" });
    }

    const room = await roomService.create({
      topic,
      roomType,
      url: "club",
      ownerId: req.user._id,
    });

    club.rooms.push(room);
    club.save();
    club = await clubService.getClubDetails(clubId);

    const structuredClub = new ClubDto(club);
    return res.json({ structuredClub, room });
  }
}

module.exports = new ClubController();
