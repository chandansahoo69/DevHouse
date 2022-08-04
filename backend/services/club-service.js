const clubModel = require("../models/club-model");

class ClubService {
  async createClub(payload) {
    //get the datas
    const { image, topic, about, rules, ownerId } = payload;
    try {
      //create the room
      const club = await clubModel.create({
        image,
        topic,
        about,
        rules,
        ownerId,
        members: [ownerId], //user is default speaker
      });
      //return room
      return club;
    } catch (error) {
      console.log("club error", error);
    }
  }

  async findAllClubs(page) {
    const pageLimit = 10;
    const pageSize = parseInt(pageLimit || 10);
    const skip = (page - 1) * pageSize;
    const total = await clubModel.countDocuments();

    const pages = Math.ceil(total / pageSize);

    const clubs = await clubModel.find().skip(skip).limit(pageSize);

    return clubs;
  }

  async getClubDetails(clubId) {
    const club = await clubModel
      .findOne({ _id: clubId })
      .populate(["members", "rooms", "ownerId"])
      .exec();
    return club;
  }
}

module.exports = new ClubService();
