import axios from "axios";

export const LOCATIONS = [
  // { lat: 22.4564591, lng: 114.0131086 }, // User Location
  { lat: 22.419373049191574, lng: 114.20637130715477, info: "CUHK" }, // CUHK
  { lat: 22.319418, lng: 114.169411, info: "Mong Kok" }, // Mong Kok
  { lat: 22.39514504695582, lng: 113.97302350741147, info: "Tuen Mun" }, // TM
  { lat: 22.448417489011774, lng: 114.004731407626, info: "Tin Shui Wai" }, // TSW
  { lat: 22.501165227665403, lng: 114.12821350691307, info: "Sheung Shui" }, // SS
  { lat: 22.3686579038788, lng: 114.10983651127317, info: "Tsuen Wan West" }, // TWW
  { lat: 22.281927189829155, lng: 114.15820043711122, info: "Central" }, // Central
  { lat: 22.264358526600375, lng: 114.23713684908698, info: "Chai WanK" }, // Chai Wan
  { lat: 22.309157798573825, lng: 114.26310624018988, info: "Tseung Kwan O" }, // TKO
  { lat: 22.287059318936127, lng: 113.94243468008456, info: "Tung Chung" }, // Tung Chung
]; // 10 locations

const updateData = async () => {
  for (const location of LOCATIONS) {
    try {
      const res = await axios.patch(
        process.env.NEXT_PUBLIC_DEV_API_PATH + "data",
        {
          latitudes: location.lat,
          longitudes: location.lng,
        }
      );
      console.log(res.data);
      // Update your loading state here
    } catch (err) {
      console.log(err);
    }
  }
  console.log("All data updated");
};

export default updateData;
