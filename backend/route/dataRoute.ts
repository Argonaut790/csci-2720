import express, { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();
import Data from "../model/data";

// Get all data
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send("Failed get all data");
  }
});

// Get one data by locationid
router.get("/location/:locationid", async (req: Request, res: Response) => {
  try {
    const data = await Data.find({ locationid: req.params.locationid });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send("Failed get one data by locationid");
  }
});

// Get all data with matched fields
router.post("/", async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query["district-s-en"])
      query["district-s-en"] = req.body["district-s-en"];
    if (req.query["location-en"])
      query["location-en"] = req.body["location-en"];
    if (req.query["district-l-en"])
      query["district-l-en"] = req.body["district-l-en"];
    if (req.query["parking-no"]) query["parking-no"] = req.body["parking-no"];
    if (req.query["provider"]) query["provider"] = req.body.provider;
    if (req.query["type"]) query["type"] = req.body.type;
    if (req.query["locationid"]) query["locationid"] = req.body.locationid;
    const data = await Data.find(query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send("Failed get all data with matched multiple field");
  }
});

// Delete one data by locationid
router.delete("/location/:locationid", async (req: Request, res: Response) => {
  try {
    const removedData = await Data.deleteOne({
      locationid: req.params.locationid,
    });
    res.status(200).json(removedData);
  } catch (err) {
    res.status(500).send("Failed delete one data by locationid");
  }
});

//Get by no
router.get("/no/:no", async (req: Request, res: Response) => {
  try {
    const data = await Data.find({ no: req.params.no });
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).send("Failed get one data by no");
  }
});

// Create one new data
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = new Data({
      "district-s-en": req.body["district-s-en"],
      "location-en": req.body["location-en"],
      img: req.body.img,
      no: "M" + req.body.no,
      "district-l-en": req.body["district-l-en"],
      "parking-no": req.body["parking-no"],
      "address-en": req.body["address-en"],
      provider: req.body.provider,
      type: req.body.type,
      "lat-long": req.body["lat-long"],
      locationid: uuidv4(),
    });
    const newData = await Data.create(data);
    console.log(newData);
    res.status(200).json(newData);
  } catch (err) {
    res.status(500).send("Failed create one new data");
  }
});

// Update one data by locationid
router.patch("/location/:locationid", async (req: Request, res: Response) => {
  console.log("I AM RUNNING HERE");
  try {
    const updatedData = await Data.updateOne(
      { locationid: req.params.locationid },
      {
        $set: {
          "district-s-en": req.body["district-s-en"],
          "location-en": req.body["location-en"],
          img: req.body.img,
          no: req.body.no,
          "district-l-en": req.body["district-l-en"],
          "parking-no": req.body["parking-no"],
          "address-en": req.body["address-en"],
          provider: req.body.provider,
          type: req.body.type,
          "lat-long": req.body["lat-long"],
          locationid: req.body.locationid,
        },
      }
    );
    console.log(updatedData);
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).send("Failed update one data by locationid");
  }
});

// Get Nearest Charging Station
router.get("/nearest", async (req: Request, res: Response) => {
  const latitudes = req.query.lat;
  const longitudes = req.query.lng;
  const max = 1; // it caps at 100 with the API
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
      res.status(500).send("Failed get nearest charging station");
    });
});

// Get Charging Stateion with matched district Only
router.get("/district", async (req: Request, res: Response) => {
  const district = req.query.district;
  // query from database
  const data = await Data.find({ "district-s-en": district });
  res.status(200).json(data);
});

// Repatch new data with government data
router.patch("/", async (req: Request, res: Response) => {
  const latitudes = req.body.latitudes;
  const longitudes = req.body.longitudes;
  const max = 100; // it caps at 100 with the API
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
          locationid: uuidv4(),
        });

        const { _id, locationid, ...dataWithout_idAndLocationid } =
          data.toObject();
        // if data is not in the database, save it

        const existedData = await Data.findOne({ no: item.no });
        if (existedData) {
          // If data already exists, update it
          try {
            const updatedData = await Data.findOneAndUpdate(
              { no: item.no },
              dataWithout_idAndLocationid,
              { new: true }
            );
            // console.log(updatedData);
          } catch (error) {
            console.error(error);
          }
        } else {
          // If data does not exist, create it
          try {
            const newData = await Data.create(data);
            // console.log(newData);
          } catch (error) {
            console.error(error);
          }
        }
      });
      res.status(200).send("Success");
    })
    .catch((err: Error) => {
      console.log(err);
    });
});

////////////
router.use(express.json());
//{"newLocat": "North Point", "newCoor": ["22.2855988576","114.18833258"], "newProvider": "CLP"}
router.post("/createNewData", async (req: Request, res: Response) => {
  console.log("this is the req", req.body);

  let inputData = req.body;

  const largestNoDocument = await Data.aggregate([
    {
      $addFields: {
        noInt: { $toInt: "$no" },
      },
    },
    {
      $sort: { noInt: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  let largestNo = largestNoDocument[0].no;
  largestNo = Number(largestNo) + 1;
  console.log("the largest no is", largestNo);

  let distSmall = inputData.newDistSmall;
  let distLarge = inputData.newDistLarge;
  let address = inputData.newDistAddress;
  let location = inputData.newLocat;
  let type = inputData.newUpdatedType;
  let [lat, long] = inputData.newCoor;
  let provider = inputData.newProvider;
  let parkingNum = inputData.newParkingNum;

  console.log("latitude", lat);
  console.log("longitude", long);

  let data = {
    "district-s-en": `${distSmall}`,
    "location-en": `${location}`,
    // img: "/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg",
    no: `${largestNo.toString()}`,
    "district-l-en": `${distLarge}`,
    "parking-no": `${parkingNum}`,
    "address-en": `${address}`,
    provider: `${provider}`,
    type: `${type}`,
    "lat-long": [parseFloat(lat), parseFloat(long)],
    locationid: uuidv4(),
  };

  // Check if the data already exists in the database
  const existingData = await Data.findOne({
    "lat-long": data["lat-long"],
    "parking-no": data["parking-no"],
  });

  if (existingData) {
    console.log("Data already exists in the database.");
  } else {
    console.log(
      "Data does not exist in the database. Creating new document..."
    );
    const result = await Data.create(data);
    console.log(`New document inserted with the following id: ${result._id}`);
  }

  let returnValue = req.body;
  res.send(returnValue);
});

router.delete("/deleteData/:deleteID", async (req: Request, res: Response) => {
  let info = req.params.deleteID;
  console.log("info: ", info);
  await Data.deleteOne({ no: info })
    .then((result) => {
      console.log("result: ", result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(400).send(err);
    });
});

//get comments by chargerId
router.get("/comments/:chargerId", async (req: Request, res: Response) => {
  try {
    const data = await Data.find({ locationid: req.params.chargerId });
    res.status(200).json(data[0].comments);
  } catch (err) {
    res.status(500).send("Failed get comments by chargerId");
  }
});

// post comments by chargerId
router.post("/comments/:chargerId", async (req: Request, res: Response) => {
  try {
    const updatedData = await Data.updateOne(
      { locationid: req.params.chargerId },
      {
        $push: {
          comments: {
            userid: req.body.userid,
            comment: req.body.comment,
          },
        },
      }
    );
    console.log(updatedData);
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).send("Failed update one data by locationid");
  }
});

router.post("/api/getSpecficData",async(req: Request, res: Response)=>{

  let incomingData = req.body.data 
  console.log("income",incomingData)
  const document = await Data.findOne({ no: incomingData });



  console.log("res",document)
  res.send(document)

})



module.exports = router;
