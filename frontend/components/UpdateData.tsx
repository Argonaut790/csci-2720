import axios from "axios";

export const LOCATIONS = [
  // { lat: 22.4564591, lng: 114.0131086 }, // User Location
  { lat: 22.312957669310823, lng: 114.1694709069294, info: "Yau Tsim Mong" }, // Yau Tsim Mong
  { lat: 22.312263908147774, lng: 114.2264018794126, info: "Kwun Tong" }, // Kwun Tong
  { lat: 22.377159870179007, lng: 114.19723973287563, info: "Shatin" }, // Shatin
  { lat: 22.282159566977967, lng: 114.22184173738505, info: "Eastern" }, // Eastern
  { lat: 22.36979174926326, lng: 114.11425935981161, info: "Tsuen Wan" }, // Tsuen Wan
  { lat: 22.277577947931675, lng: 114.17383118307438, info: "Wan Chai" }, // Wan Chai
  { lat: 22.447553202846628, lng: 114.02614444721702, info: "Yuen Long" }, // Yuen Long
  { lat: 22.248359754635352, lng: 114.18148240877103, info: "Southern" }, // Southern
  { lat: 22.329370669863494, lng: 114.18430061201441, info: "Kowloon City" }, // Kowloon City
  { lat: 22.394904051563273, lng: 113.97251396939237, info: "Tuen Mun" }, // Tuen Mun
  { lat: 22.500623503693372, lng: 114.12955665246086, info: "North" }, // North
  { lat: 22.330726846687362, lng: 114.15185252943887, info: "Sham Shui Po" }, // Sham Shui Po
  { lat: 22.343178996550186, lng: 114.19450065854873, info: "Wong Tai Sin" }, // Wong Tai Sin
  { lat: 22.362753293667296, lng: 114.13115568275614, info: "Kwai Tsing" }, // Kwai Tsing
  { lat: 22.38283448260053, lng: 114.2711912133148, info: "Sai Kung" }, // Sai Kung
  {
    lat: 22.289973589491137,
    lng: 113.9404001606481,
    info: "Outlying Islands",
  }, // Outlying Islands
  {
    lat: 22.280180035857384,
    lng: 114.158190870188,
    info: "Central and Western",
  }, // Central and Western
  { lat: 22.448882705818566, lng: 114.16634101972066, info: "Tai Po" }, // Tai Po
]; // 18 locations

const updateData = async () => {
  const updatePoints = [
    { lat: 22.441397973458077, lng: 114.00971068617784 },
    { lat: 22.361374001958698, lng: 114.12607101646108 },
    { lat: 22.269591831281872, lng: 114.18731329555753 },
    { lat: 22.3825535876255, lng: 114.2107534885335 },
    { lat: 22.268495072778617, lng: 113.94986137958266 },
  ];

  for (const location of updatePoints) {
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
