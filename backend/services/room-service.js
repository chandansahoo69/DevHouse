const RoomDto = require("../dtos/room-dto");
const RoomModel = require("../models/room-model");

class RoomService {
  async create(payload) {
    //get the datas
    const { topic, roomType, ownerId, url } = payload;
    //create the room
    const room = await RoomModel.create({
      topic,
      roomType,
      ownerId,
      url,
      speakers: [ownerId], //user is default speaker
    });
    //return room
    return room;
  }

  async getAllRooms(types) {
    //fetch all the records according to the types
    //populate will complete fetch the user instead of only id
    const rooms = await RoomModel.find({
      roomType: { $in: types },
      url: { $in: "room" },
    })
      .populate("speakers")
      .populate("ownerId")
      .exec();
    return rooms;
  }

  async getRoomDetails(roomId) {
    const room = await RoomModel.findOne({ _id: roomId });
    return room;
  }
}

module.exports = new RoomService();
