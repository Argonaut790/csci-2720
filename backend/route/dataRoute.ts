import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();
const Data = require("../model/data");

// Get all data
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one data
// router.get("/:id", getData, (req: Request, res: Response) => {
//   res.json(res.data);
// });

// Update all data
router.patch("/", async (req: Request, res: Response) => {
  console.log("req.body");
  const latitudes = 22.329752304376473;
  const longitudes = 114.18571472167969;
  const max = 100; // it caps at 100 with the API
  console.log(
    process.env.GOV_DATA_API +
      "?lat=" +
      latitudes +
      "&long=" +
      longitudes +
      "&max=" +
      max
  );
  axios
    .get(
      process.env.GOV_DATA_API +
        "?lat=" +
        latitudes +
        "&long=" +
        longitudes +
        "&max=" +
        max
    )
    .then((response: any) => {
      //   console.log(response.data);
      console.log(response.data.results.length);
      //   {"results": [{
      //    'district-s-en': 'Wan Chai',
      //    'location-en': 'Mira Moon Hotel',
      //    'address-zh': '銅鑼灣謝斐道388號',
      //    img: null,
      //    no: '209',
      //    'district-l-en': 'Hong Kong Island',
      //    'parking-no': 'Tesla only',
      //    'district-s-zh': '灣仔區',
      //    'address-en': '388 Jaffe Road, Causeway Bay',
      //    provider: 'Others',
      //    type: 'SemiQuick',
      //    'district-l-zh': '香港島',
      //    'lat-long': [Array],
      //    'location-zh': '問月酒店'
      //  }]}
      // map the list of result and save to database
      response.data.results.map(async (item: any) => {
        if (!item["parking-no"]) item["parking-no"] = "N/A";

        const data = new Data({
          "district-s-en": item["district-s-en"],
          "location-en": item["location-en"],
          img: item.img,
          no: item.no,
          "district-l-en": item["district-l-en"],
          "parking-no": item["parking-no"],
          "address-en": item["address-en"],
          provider: item.provider,
          type: item.type,
          "lat-long": item["lat-long"],
        });

        // if data is not in the database, save it
        const existedData = await Data.find({ no: item.no });
        if (existedData.length === 0) {
          try {
            await data.save();
          } catch (error) {
            console.error(error);
            // Handle the error here. Don't send a response.
          }
        }
      });

      // set header to plain text
      //   res.setHeader("Content-Type", "text/plain");
      console.log("Updated");
      res.status(200).send(response.data);
    })
    .catch((err: Error) => {
      console.log(err);
    });
});

module.exports = router;
