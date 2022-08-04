class ClubDto {
  id;
  image;
  topic;
  about;
  rules;
  rooms;
  ownerId;
  createdAt;
  members;

  constructor(room) {
    this.id = room._id;
    this.topic = room.topic;
    this.image = room.image;
    this.about = room.about;
    this.rules = room.rules;
    this.rooms = room.rooms;
    this.members = room.members;
    this.ownerId = room.ownerId;
    this.createdAt = room.createdAt;
  }
}

module.exports = ClubDto;
