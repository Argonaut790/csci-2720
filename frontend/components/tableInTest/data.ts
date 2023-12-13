import React from "react";

// useEffect(() => {
//     axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "data").then((res) => {
//       setRows(res.data);
//     });
//   }, []);
//   const columns = [
//     { key: "no", label: "Number" },
//     { key: "location-en", label: "Location" },
//     { key: "district-s-en", label: "District Small" },
//     // { key: "img", label: "Image" },
//     { key: "district-l-en", label: "District Large" },
//     { key: "parking-no", label: "Parking Notes" },
//     { key: "address-en", label: "Address" },
//     { key: "provider", label: "Provider" },
//     { key: "type", label: "Type" },
//     { key: "lat-long", label: "Latitude and Longtitude" },
//   ];


const columns = [
  {name: "number", uid: "number", sortable: true},
  {name: "location", uid: "location", sortable: true},
  {name: "districtSmall", uid: "districtSmall", sortable: true},
  {name: "districtLarge", uid: "districtLarge", sortable: true},
  {name: "parkingNumber", uid: "parkingNumber",sortable: true},
  {name: "provider", uid: "provider"},
  {name: "latLong", uid: "latLong"},
  {name: "ACTIONS", uid: "actions"},
];
// const columns = [
//     {name: "ID", uid: "id", sortable: true},
//     {name: "NAME", uid: "name", sortable: true},
//     {name: "AGE", uid: "age", sortable: true},
//     {name: "ROLE", uid: "role", sortable: true},
//     {name: "TEAM", uid: "team"},
//     {name: "EMAIL", uid: "email"},
//     {name: "STATUS", uid: "status", sortable: true},
//     {name: "ACTIONS", uid: "actions"},
//   ];




const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];



const data = [
    {"_id":{"$oid":"65794a64df76bc9b7f182716"},"district-s-en":"Shatin","location-en":"Hong Kong Science Park","img":"/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg","no":"19","district-l-en":"New Territories","parking-no":"D042 - D052, D106 - D112","address-en":"Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.","provider":"CLP","type":"SemiQuick","lat-long":[{"$numberDouble":"22.4262580871582"},{"$numberDouble":"114.20987701416"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5df"},"district-s-en":"Shatin","location-en":"Hong Kong Science Park","img":"/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg","no":"26","district-l-en":"New Territories","parking-no":"D104","address-en":"Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.","provider":"CLP","type":"Quick","lat-long":[{"$numberDouble":"22.4263610839844"},{"$numberDouble":"114.209915161133"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5e2"},"district-s-en":"Shatin","location-en":"The Tolo Place","img":null,"no":"142","district-l-en":"New Territories","parking-no":"N/A","address-en":"1 On Chun Street, Ma On Shan","provider":"Others","type":"Standard","lat-long":[{"$numberDouble":"22.4255027770996"},{"$numberDouble":"114.229858398438"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5ea"},"district-s-en":"Shatin","location-en":"Corporation Park","img":"/EV/PublishingImages/common/map/map_thumb/Corporation%20Park.jpg","no":"66","district-l-en":"New Territories","parking-no":"N/A","address-en":"Corporation Park Carpark G/F, \n11 On Lai Street, Shatin, NT","provider":"Others","type":"Standard","lat-long":[{"$numberDouble":"22.3893356323242"},{"$numberDouble":"114.207504272461"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5f4"},"district-s-en":"Tai Po","location-en":"Fu Shin Shopping Centre","img":null,"no":"190","district-l-en":"New Territories","parking-no":"BYD only","address-en":"12 On Po Rd, Tai Po","provider":"Others","type":"Quick","lat-long":[{"$numberDouble":"22.4543685913086"},{"$numberDouble":"114.174835205078"}],"__v":{"$numberInt":"0"}},
    
];

export {columns, statusOptions, data};
