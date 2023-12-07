import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  // TODO: check duplicate id
  userId: {
    type: String,
    required: true,
    default: () => uuidv4().substr(0, 6),
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  //   isActivated: {
  //     type: Boolean,
  //     default: true,
  //   },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accounts", AccountSchema);
