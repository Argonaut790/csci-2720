import { Input, Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";
import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import axios from "axios";
import { set } from "react-hook-form";
import { useUserSystem } from "@/contexts/UserSystemContext";
import { useNearestCharger } from "@/contexts/NearestChargerContext";
interface Props {
  lat: number;
  lng: number;
  info: string;
}

interface GoogleMapsProps {
  className?: string;
  curCoordinate: number[];
  nearestCoordinate: number[];
}

interface data {
  "district-s-en": string;
  "location-en": string;
  img: string;
  no: string;
  "district-l-en": string;
  "parking-no": string;
  "address-en": string;
  provider: string;
  type: string;
  "lat-long": number[];
}

const GoogleMaps = ({ className }: GoogleMapsProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const DEFAULT_ZOOM = 14;
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [renderCounter, setRenderCounter] = useState(0);

  const {
    userMarker,
    nearestChargerMarker,
    curCoordinate,
    nearestCoordinate,
    setUserMarker,
    setNearestChargerMarker,
    setCurCoordinate,
    setNearestCoordinate,
  } = useNearestCharger();

  const addLocationMarker = ({ info }: { location: number[]; info?: string }) => {
    if (curCoordinate.length == 0 && nearestCoordinate.length == 0) return;
    console.log("current coordinate", curCoordinate);

    deleteMarkers(true);

    const user_svgMarker = {
      path: "M22,2V4H20V2H18V6a2,2,0,0,0,2,2V18a1,1,0,0,1-1,1H16V11H13V9h3V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9H3v2H0V24H16V21h3a3,3,0,0,0,3-3V8a2,2,0,0,0,2-2V2ZM10.772,11.426,9.008,14.959l-1.789-.893L8.75,11H6.615A1.614,1.614,0,0,1,5.07,8.917L7.293,4.756l1.76.949L7.275,9H9.4a1.6,1.6,0,0,1,1.376,2.426Z",
      fillColor: "red",
      fillOpacity: 1,
      strokeWeight: 2,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    const nearest_charger_svgMarker = {
      path: "M22,2V4H20V2H18V6a2,2,0,0,0,2,2V18a1,1,0,0,1-1,1H16V11H13V9h3V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9H3v2H0V24H16V21h3a3,3,0,0,0,3-3V8a2,2,0,0,0,2-2V2ZM10.772,11.426,9.008,14.959l-1.789-.893L8.75,11H6.615A1.614,1.614,0,0,1,5.07,8.917L7.293,4.756l1.76.949L7.275,9H9.4a1.6,1.6,0,0,1,1.376,2.426Z",
      fillColor: "blue",
      fillOpacity: 1,
      strokeWeight: 2,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    let marker_2 = new google.maps.Marker({
      position: { lat: nearestCoordinate[0], lng: nearestCoordinate[1] },
      icon: nearest_charger_svgMarker,
      draggable: false,
      map: map,
    });
    setNearestChargerMarker(marker_2);

    let marker_1 = new google.maps.Marker({
      position: { lat: curCoordinate[0], lng: curCoordinate[1] },
      icon: user_svgMarker,
      draggable: false,
      map: map,
    });
    setUserMarker(marker_1);

    if (info) {
      // info window
      let user_infowindow = new google.maps.InfoWindow({
        content: `<div class=" h-4 font-bold text-black">User's Location</div>`, // 支援html
      });

      user_infowindow.open(map, marker_1);

      let nearest_infowindow = new google.maps.InfoWindow({
        content: `<div class=" h-4 font-bold text-black">Nearest Charger</div>`, // 支援html
      });

      nearest_infowindow.open(map, marker_2);

      // marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
      //   infowindow.open(map, marker);
      // });
    }

    // info window
    // let infowindow = new google.maps.InfoWindow({
    //   content: `<div class=" h-4 font-bold text-black">${position.info}</div>`, // 支援html
    // });

    // marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
    //   infowindow.open(map, marker);
    // });
  };

  // // Sets the map on all markers in the array.
  // const setMapOnAll = (map: google.maps.Map | null) => {
  //   for (let i = 0; i < markers.length; i++) {
  //     markers[i].setMap(map);
  //   }
  // };

  // // Removes the markers from the map, but keeps them in the array.
  // const hideMarkers = () => {
  //   setMapOnAll(null);
  // };

  // // Shows any markers currently in the array.
  // const showMarkers = () => {
  //   setMapOnAll(map);
  // };

  // Deletes all markers in the array by removing references to them.
  const deleteMarkers = (user: boolean) => {
    const localUserMarker = userMarker;
    if (localUserMarker != null) localUserMarker.setMap(null);
    const localNearestChargerMarker = nearestChargerMarker;
    if (localNearestChargerMarker != null) localNearestChargerMarker.setMap(null);
  };

  // Initialize the map
  useEffect(() => {
    if (ref.current && curCoordinate.length > 0) {
      const initialMap = new window.google.maps.Map(ref.current, {
        center: { lat: curCoordinate[0], lng: curCoordinate[1] },
        zoom: DEFAULT_ZOOM,
      });
      setMap(initialMap);
    }
  }, [ref]);

  // Add markers whenever curCoordinate or nearestCoordinate changes
  useEffect(() => {
    setRenderCounter(renderCounter + 1);
    if (map && curCoordinate.length > 0 && nearestCoordinate.length > 0) {
      console.log("Rendder Counter: " + renderCounter);
      console.log("curCoordinate: " + curCoordinate);
      console.log("nearestCoordinate: " + nearestCoordinate);

      addLocationMarker({
        location: curCoordinate,
        info: "User's Location",
      });

      // Create the initial InfoWindow.
      let infoWindow = new google.maps.InfoWindow({
        content: "<div class='text-black'>Click the map to get Lat/Lng!</div>",
        position: { lat: curCoordinate[0], lng: curCoordinate[1] },
      });

      // infoWindow.open(map);

      // Configure the click listener.
      map.addListener("click", (mapsMouseEvent: any) => {
        // Close the current InfoWindow.
        infoWindow.close();

        console.log("Clicked");
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
          "<div class=' text-black font-bold'>You Pointed Here!"
          // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        // infoWindow.open(map);
        const pointed = mapsMouseEvent.latLng.toJSON();
        setCurCoordinate([pointed.lat, pointed.lng]);
      });
    }
  }, [map, curCoordinate, nearestCoordinate]);

  return (
    <div ref={ref} style={{ width: "100%" }} className=" rounded-2xl aspect-video shadow-lg" />
  );
};

export const GetNearestCharger = async (lat: number, lng: number) => {
  console.log("GetNearestCharger");
  console.log(process.env.NEXT_PUBLIC_DEV_API_PATH + "data/nearest?lat=" + lat + "&lng=" + lng);
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_DEV_API_PATH + "data/nearest?lat=" + lat + "&lng=" + lng
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const NearestCharger = () => {
  const { curCoordinate, nearestCoordinate, extraInfo, setNearestCoordinate, setExtraInfo } =
    useNearestCharger();

  const latRef = useRef<HTMLInputElement | null>(null);
  const lngRef = useRef<HTMLInputElement | null>(null);

  const handleOnClickGetNearestLocations = () => {
    //get nearest charger location from
    GetNearestCharger(curCoordinate[0], curCoordinate[1])
      .then((result) => {
        setNearestCoordinate(result["lat-long"]);
        console.log("Context Updated the NearestCoor " + result);
        setExtraInfo(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div id="NearestChargerSection" className=" flex flex-col gap-6">
        <h1 className="flex justify-start lg:h-20 mb-6 text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Find Charger that near you
        </h1>
        <div className=" flex flex-row">
          <div className=" w-2/3">
            <GoogleMapsWrapper>
              <GoogleMaps curCoordinate={curCoordinate} nearestCoordinate={nearestCoordinate} />
            </GoogleMapsWrapper>
          </div>
          <div className="px-10 flex flex-col gap-4 w-1/3 justify-center items-center">
            <Input
              className=" w-2/3"
              type="number"
              label="Latitude"
              // placeholder="22.419373049191574"
              variant="underlined"
              value={curCoordinate && curCoordinate[0].toString()}
              labelPlacement="outside"
              readOnly
              disabled
              ref={latRef}
              // endContent={
              //   <div className="pointer-events-none flex items-center">
              //     <span className="text-default-400 text-small">$</span>
              //   </div>
              // }
            />
            <Input
              className=" w-2/3"
              type="number"
              label="Longtitude"
              // placeholder="114.20637130715477"
              variant="underlined"
              value={curCoordinate && curCoordinate[1].toString()}
              labelPlacement="outside"
              readOnly
              disabled
              ref={lngRef}
              // endContent={
              //   <div className="pointer-events-none flex items-center">
              //     <span className="text-default-400 text-small">$</span>
              //   </div>
              // }
            />
            <Button onClick={() => handleOnClickGetNearestLocations()}>Get Nearest Charger</Button>
          </div>
        </div>
        <div className=" grid grid-cols-3 gap-6 h-[250px]">
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">User's Location</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70">
              Latitude: {curCoordinate && curCoordinate[0]}
              <br />
              Longtitude: {curCoordinate && curCoordinate[1]}
            </CardBody>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">Nearest Charger Location</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70">
              Latitude: {nearestCoordinate && nearestCoordinate[0]}
              <br />
              Longtitude: {nearestCoordinate && nearestCoordinate[1]}
            </CardBody>
          </Card>
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">More Info</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70">
              <span>Location: {extraInfo?.["location-en"] || "None"}</span>
              <span>Address: {extraInfo?.["address-en"] || "None"}</span>
              <span>District: {extraInfo?.["district-s-en"] || "None"}</span>
              <span>Parking Notes: {extraInfo?.["parking-no"] || "None"}</span>
              <span>Provider: {extraInfo?.["provider"] || "None"}</span>
              <span>Type: {extraInfo?.["type"] || "None"}</span>
            </CardBody>
          </Card>
          <Card className="py-4 h-full pb-0">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">Comments</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70 overflow-y-scroll h-full">
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
              <p> Testing Comment</p>
            </CardBody>
            <Divider />
            <CardFooter className=" p-0">
              <Input
                type="text"
                label="Comment"
                // placeholder="Write your Comment"
                className=" py-4 px-2 "
                variant="underlined"
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NearestCharger;
