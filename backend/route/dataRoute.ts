import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();
import Data from "../model/data";

// Get all data
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Data.find();
    res.status(200).json(data).send("Success get all data");
  } catch (err) {
    res.status(500).json(err).send("Failed get all data");
  }
});

// Get one data by locationid
router.get("/:locationid", async (req: Request, res: Response) => {
  try {
    const data = await Data.find({ locationid: req.params.locationid });
    res.status(200).json(data).send("Success get one data by locationid");
  } catch (err) {
    res.status(500).json(err).send("Failed get one data by locationid");
  }
});

// Get all data with matched fields
router.post("/", async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query["district-s-en"]) query["district-s-en"] = req.body["district-s-en"];
    if (req.query["location-en"]) query["location-en"] = req.body["location-en"];
    if (req.query["district-l-en"]) query["district-l-en"] = req.body["district-l-en"];
    if (req.query["parking-no"]) query["parking-no"] = req.body["parking-no"];
    if (req.query["provider"]) query["provider"] = req.body.provider;
    if (req.query["type"]) query["type"] = req.body.type;
    if (req.query["price"]) query["price"] = req.body.price;
    if (req.query["locationid"]) query["locationid"] = req.body.locationid;
    const data = await Data.find(query);
    res.status(200).json(data).send("Success get all data with matched multiple field");
  } catch (err) {
    res.status(500).json(err).send("Failed get all data with matched multiple field");
  }
});

// Delete one data by locationid
router.delete("/:locationid", async (req: Request, res: Response) => {
  try {
    const removedData = await Data.deleteOne({ locationid: req.params.locationid });
    res.status(200).json(removedData).send("Success delete one data by locationid");
  } catch (err) {
    res.status(500).json({ message: err }).send("Failed delete one data by locationid");
  }
});

// Create one new data
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = new Data({
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
      price: req.body["price"],
      locationid: req.body["locationid"],
    });
    const newData = await Data.create(data);
    console.log(newData);
    res.status(200).json(newData).send("Success create one new data");
  } catch (err) {
    res.status(500).json({ message: err }).send("Failed create one new data");
  }
});

// Update one data by locationid
router.patch("/:locationid", async (req: Request, res: Response) => {
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
    res.status(200).json(updatedData).send("Success update one data by locationid");
  } catch (err) {
    res.status(500).json({ message: err }).send("Failed update one data by locationid");
  }
});

// Get Nearest Charging Station
router.get("/nearest", async (req: Request, res: Response) => {
  const latitudes = req.query.lat;
  const longitudes = req.query.lng;
  const max = 1; // it caps at 100 with the API
  console.log("hello");
  console.log(
    process.env.GOV_DATA_API + "?lat=" + latitudes + "&long=" + longitudes + "&max=" + max
  );
  axios
    .get(process.env.GOV_DATA_API + "?lat=" + latitudes + "&long=" + longitudes + "&max=" + max)
    .then((response: any) => {
      console.log(response.data.results[0]);
      res.status(200).send(response.data.results[0]);
    })
    .catch((err: Error) => {
      console.log(err);
    });
});

// Repatch new data with government data
router.patch("/", async (req: Request, res: Response) => {
  const latitudes = req.body.latitudes;
  const longitudes = req.body.longitudes;
  const max = 100; // it caps at 100 with the API
  axios
    .get(process.env.GOV_DATA_API + "?lat=" + latitudes + "&long=" + longitudes + "&max=" + max)
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
          price: item["price"],
          locationid: item["locationid"],
        });

        // if data is not in the database, save it
        const existedData = await Data.find({ no: item.no });
        if (existedData.length === 0) {
          try {
            const newData = await Data.create(data);
            console.log(newData);
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

module.exports = router;
