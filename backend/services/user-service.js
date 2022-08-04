const UserModel = require("../models/user-model");
const mongoose = require("mongoose");

class UserService {
  async findUser(filter) {
    //find the user present or not
    const user = await UserModel.findOne(filter);
    return user;
  }

  async createUser(data) {
    const user = await UserModel.create(data);
    return user;
  }

  async findAllUsers(userId, page) {
    //set the no of item shown at a time
    const pageLimit = 10;
    const pageSize = parseInt(pageLimit || 10);
    const skip = (page - 1) * pageSize;
    const total = await UserModel.countDocuments();

    const pages = Math.ceil(total / pageSize);

    let users = await UserModel.find().skip(skip).limit(pageSize);
    users = users.filter((el) => {
      return el._id.toString() !== userId;
    });
    return users;
  }
}

module.exports = new UserService();
