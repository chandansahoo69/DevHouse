const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        if (avatar) return `${process.env.BASE_URL}${avatar}`; //getter used to set some value
        return avatar;
      },
    },
    followers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
    },
    clubs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Club",
        },
      ],
      required: false,
    },
    rooms: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Room",
        },
      ],
      required: false,
    },
    activated: { type: Boolean, dafault: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, //set the allow getters to make changes
  }
);

module.exports = mongoose.model("User", userSchema, "users");
