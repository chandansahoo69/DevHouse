class UserDto {
  id;
  phone;
  name;
  avatar;
  activated;
  createdAt;
  followers;
  following;
  clubs;
  rooms;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
    this.following = user.following;
    this.followers = user.followers;
    this.clubs = user.clubs;
    this.rooms = user.rooms;
  }
}

module.exports = UserDto;
