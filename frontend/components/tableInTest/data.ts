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


const columnsInfo = [
  {name: "number", uid: "number", sortable: true},
  {name: "location", uid: "location", sortable: true},
  {name: "districtSmall", uid: "districtSmall", sortable: true},
  {name: "districtLarge", uid: "districtLarge", sortable: true},
  {name: "parkingNumber", uid: "parkingNumber",sortable: true},
  {name: "provider", uid: "provider" },
  {name: "latLong", uid: "latLong"},
  {name: "type", uid: "type"},
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
  {name: "Standard", uid: "Standard"},
  {name: "Quick", uid: "Quick"},
  {name: "SemiQuick", uid: "SemiQuick"},
];



const data = [
    {"_id":{"$oid":"65794a64df76bc9b7f182716"},"district-s-en":"Shatin","location-en":"Hong Kong Science Park","img":"/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg","no":"19","district-l-en":"New Territories","parking-no":"D042 - D052, D106 - D112","address-en":"Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.","provider":"CLP","type":"SemiQuick","lat-long":[{"$numberDouble":"22.4262580871582"},{"$numberDouble":"114.20987701416"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5df"},"district-s-en":"Shatin","location-en":"Hong Kong Science Park","img":"/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg","no":"26","district-l-en":"New Territories","parking-no":"D104","address-en":"Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.","provider":"CLP","type":"Quick","lat-long":[{"$numberDouble":"22.4263610839844"},{"$numberDouble":"114.209915161133"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5e2"},"district-s-en":"Shatin","location-en":"The Tolo Place","img":null,"no":"142","district-l-en":"New Territories","parking-no":"N/A","address-en":"1 On Chun Street, Ma On Shan","provider":"Others","type":"Standard","lat-long":[{"$numberDouble":"22.4255027770996"},{"$numberDouble":"114.229858398438"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5ea"},"district-s-en":"Shatin","location-en":"Corporation Park","img":"/EV/PublishingImages/common/map/map_thumb/Corporation%20Park.jpg","no":"66","district-l-en":"New Territories","parking-no":"N/A","address-en":"Corporation Park Carpark G/F, \n11 On Lai Street, Shatin, NT","provider":"Others","type":"Standard","lat-long":[{"$numberDouble":"22.3893356323242"},{"$numberDouble":"114.207504272461"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5f4"},"district-s-en":"Tai Po","location-en":"Fu Shin Shopping Centre","img":null,"no":"190","district-l-en":"New Territories","parking-no":"BYD only","address-en":"12 On Po Rd, Tai Po","provider":"Others","type":"Quick","lat-long":[{"$numberDouble":"22.4543685913086"},{"$numberDouble":"114.174835205078"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5f2"},"district-s-en":"Shatin","location-en":"New Town Plaza III","img":null,"no":"138","district-l-en":"New Territories","parking-no":"N/A","address-en":"9 Shatin Centre Street, Shatin","provider":"Others","type":"Standard","lat-long":[{"$numberDouble":"22.3800792694092"},{"$numberDouble":"114.18709564209"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5f5"},"district-s-en":"Tai Po","location-en":"Tai Wo Shopping Centre","img":"/EV/PublishingImages/common/map/map_thumb/Entrance_tai%20wo_large.jpg","no":"10","district-l-en":"New Territories","parking-no":"B1-B3","address-en":"Tai Wo Shopping Centre, 1/F Carpark\nTai Wo Estate, Tai Po, NT","provider":"CLP","type":"SemiQuick","lat-long":[{"$numberDouble":"22.4504833221436"},{"$numberDouble":"114.160835266113"}],"__v":{"$numberInt":"0"}},
    {"_id":{"$oid":"6577f808c80457eef44ae5f3"},"district-s-en":"Tai Po","location-en":"Uptown Plaza","img":"/EV/PublishingImages/EVQC%20-%20Uptown%20Plaza.JPG","no":"181","district-l-en":"New Territories","parking-no":"R101","address-en":"Uptown Plaza Carpark, 2/F, Uptown Plaza, Tai Po","provider":"CLP","type":"Quick","lat-long":[{"$numberDouble":"22.4442234039307"},{"$numberDouble":"114.168502807617"}],"__v":{"$numberInt":"0"}}
];






export {columnsInfo, statusOptions, data};
