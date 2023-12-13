import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  "district-s-en": {
    type: String,
    required: true,
  },
  "location-en": {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  no: {
    type: String,
    required: true,
    unique: true,
  },
  "district-l-en": {
    type: String,
    required: true,
  },
  "parking-no": {
    type: String,
    required: true,
  },
  "address-en": {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  "lat-long": {
    type: [Number],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  locationid: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("data", DataSchema);
