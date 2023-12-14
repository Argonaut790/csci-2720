import mongoose from "mongoose";
const Schema = mongoose.Schema;

// {
//     "district-s-en": "Shatin",
//     "location-en": "Royal Park Hotel",
//     "img": null,
//     "no": "223",
//     "district-l-en": "New Territories",
//     "parking-no": "Tesla only",
//     "address-en": "8 Pak Hok Ting Street, Shatin",
//     "provider": "Others",
//     "type": "SemiQuick",
//     "lat-long": [
//         22.3795566558838,
//         114.188835144043
//     ],
// },

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
});





module.exports = mongoose.model("data", DataSchema);
