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

// Get Nearest Charging Station
router.get("/nearest", async (req: Request, res: Response) => {
  const latitudes = req.query.lat;
  const longitudes = req.query.lng;
  const max = 1; // it caps at 100 with the API
  console.log("hello");
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
      console.log(response.data.results[0]);
      res.status(200).send(response.data.results[0]);
    })
    .catch((err: Error) => {
      console.log(err);
    });
});

// Update all data
router.patch("/", async (req: Request, res: Response) => {
  console.log("req.body");
  // const latitudes = 22.329752304376473;
  // const longitudes = 114.18571472167969;
  const latitudes = req.body.latitudes;
  const longitudes = req.body.longitudes;
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

        const { no, ...itemWithoutNo } = item;

  const dataNoNum = new Data({
    ...itemWithoutNo
  });

        // if data is not in the database, save it
        
        const existedData = await Data.find(dataNoNum);
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



////////////
router.use(express.json())
//{"newLocat": "North Point", "newCoor": ["22.2855988576","114.18833258"], "newProvider": "CLP"}
router.post("/api/createNewData",async(req: Request, res: Response)=>{


  console.log("this is the req",req.body.newCoor)

  let inputData = req.body


const largestNoDocument = await Data.aggregate([
  {
    $addFields: {
      noInt: { $toInt: "$no" }
    }
  },
  {
    $sort: { noInt: -1 }
  },
  {
    $limit: 1
  }
]);
let largestNo = largestNoDocument[0].no;
largestNo = Number(largestNo)+1
console.log("the largest no is",largestNo)

let [lat, long] = inputData.newCoor
console.log("latitude",lat)
console.log("longitude",long)

let data={
"district-s-en":"Special1",
"location-en":"Specia1",
"img":"/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg",
"no":`${(largestNo).toString()}`,
// "no":"241",
"district-l-en":"New Territories",
"parking-no":"D042 - D052, D106 - D112",
"address-en":"Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.",
"provider":`${inputData}`,
"type":"SemiQuick",
"lat-long":[parseFloat(lat),parseFloat(long)],
"__v":0
}

// Check if the data already exists in the database
const existingData = await Data.findOne({ "lat-long": data["lat-long"], "parking-no": data["parking-no"] });

if (existingData) {
  console.log('Data already exists in the database.');
} else {
  console.log('Data does not exist in the database. Creating new document...');
  const result = await Data.create(data);
  console.log(`New document inserted with the following id: ${result._id}`);
}



  let returnValue = req.body
  res.send(returnValue)

})

module.exports = router;
