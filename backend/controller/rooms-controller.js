const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");
const RoomModel = require("../models/room-model");
const userModel = require("../models/user-model");

class RoomsController {
  async create(req, res) {
    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!!!" });
    }
    const userId = req.user._id;
    //create a room
    const room = await roomService.create({
      topic,
      roomType,
      url: "room",
      ownerId: userId,
    });

    //update the club in user's club array
    const user = await userModel.findOne({ _id: userId });
    user.rooms.push(room._id);
    const updateUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      user,
      {
        new: true,
      }
    );

    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const page = req.query.page || 1;
    //pass the filter as we only show the public rooms not private rooms
    const types = "open";

    const pageLimit = 8;
    const pageSize = parseInt(pageLimit || 8);
    const skip = (page - 1) * pageSize;
    const total = await RoomModel.countDocuments();

    const pages = Math.ceil(total / pageSize);

    let rooms = await RoomModel.find({
      roomType: { $in: types },
      //   url: { $in: "room" },
    })
      .skip(skip)
      .limit(pageSize)
      .populate("speakers")
      .populate("ownerId")
      .exec();

    //structured all the rooms
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json({ allRooms, pages });
  }

  async showRoomDetails(req, res) {
    const room = await roomService.getRoomDetails(req.params.roomId);
    return res.json(room);
  }
}

module.exports = new RoomsController();
