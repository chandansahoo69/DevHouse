const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
      get: (clubImage) => {
        if (clubImage) return `${process.env.BASE_URL}${clubImage}`; //getter used to set some value
        return clubImage;
      },
    },
    topic: { type: String, required: true },
    about: { type: String, required: false },
    rules: { type: String, required: false },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    rooms: [
      {
        topic: { type: String, required: true },
        roomType: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: "User" },
        speakers: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          required: false,
        },
      },
    ],
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("Club", clubSchema, "clubs");
