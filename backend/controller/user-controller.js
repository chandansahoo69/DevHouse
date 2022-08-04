const UserDto = require("../dtos/user-dto");
const userModel = require("../models/user-model");
const userService = require("../services/user-service");

class UserController {
  async getAllUsers(req, res) {
    const page = req.query.page || 1;
    const users = await userService.findAllUsers(req.user._id, page);
    return res.json(users);
  }

  async findSingleUser(req, res) {
    const userId = req.params.id;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["followers", "following", "clubs", "rooms"])
      .exec();
    return res.json(user);
  }

  async FollowUnfollowUser(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    if (!req.user._id) {
      return res.json({ message: "Unauthenticated" });
    }

    try {
      //get the user to be followed
      const user = await userService.findUser({ _id: id });

      //get the user who follow the current user to update the following count
      const followingUser = await userService.findUser({ _id: userId });
      //find if user is there or not
      const index = user.followers.findIndex(
        (obj) => String(obj._id) === String(userId)
      );

      if (index === -1) {
        //user is not inside followers then put it
        user.followers.push(userId);
        //now add the currentUser to the following array
        followingUser.following.push(id);
      } else {
        //if user is already there now leave the user from this room
        user.followers = user.followers.filter(
          (obj) => String(obj._id) !== String(userId)
        );

        //remove the currentUser from following array of followingUser
        followingUser.following = followingUser.following.filter(
          (obj) => String(obj._id) !== String(id)
        );
      }
      const updatedUser = await userModel
        .findByIdAndUpdate({ _id: id }, user, {
          new: true,
        })
        .populate(["followers", "following", "clubs"])
        .exec();
      await userModel.findByIdAndUpdate({ _id: userId }, followingUser, {
        new: true,
      });
      return res.json(new UserDto(updatedUser));
    } catch (error) {
      console.log("joining room error", error);
    }
  }

  async getAllFollowers(req, res) {
    const { userId } = req.params;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["followers"])
      .exec();
    const followers = user.followers;
    res.json({ followers });
  }

  async getAllFollowing(req, res) {
    const { userId } = req.params;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["following"])
      .exec();
    const following = user.following;
    res.json({ following });
  }
}

module.exports = new UserController();
