import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
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

  const addLocationMarker = ({
    info,
  }: {
    location: number[];
    info?: string;
  }) => {
    if (curCoordinate.length == 0 && nearestCoordinate.length == 0) return;

    deleteMarkers(true);

    const user_svgMarker = {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "red",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    const nearest_charger_svgMarker = {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 1,
      strokeWeight: 0,
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
    if (localNearestChargerMarker != null)
      localNearestChargerMarker.setMap(null);
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
    <div
      ref={ref}
      style={{ width: "100%" }}
      className=" rounded-2xl aspect-video shadow-lg"
    />
  );
};

export const GetNearestCharger = async (lat: number, lng: number) => {
  console.log("GetNearestCharger");
  console.log(
    process.env.NEXT_PUBLIC_DEV_API_PATH +
      "data/nearest?lat=" +
      lat +
      "&lng=" +
      lng
  );
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_DEV_API_PATH +
        "data/nearest?lat=" +
        lat +
        "&lng=" +
        lng
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const NearestCharger = () => {
  const {
    curCoordinate,
    nearestCoordinate,
    extraInfo,
    setNearestCoordinate,
    setExtraInfo,
  } = useNearestCharger();

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
      <div className=" flex flex-col gap-6 max-h-screen">
        <h1 className=" text-4xl">Nearest Charger</h1>
        <div className=" flex flex-row">
          <div className=" w-2/3">
            <GoogleMapsWrapper>
              <GoogleMaps
                curCoordinate={curCoordinate}
                nearestCoordinate={nearestCoordinate}
              />
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
            <Button onClick={() => handleOnClickGetNearestLocations()}>
              Get Nearest Locations
            </Button>
          </div>
        </div>
        <div className=" grid grid-cols-3 gap-6 h-full">
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">User's Location</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70">
              Latitude: {curCoordinate[0]}
              <br />
              Longtitude: {curCoordinate[1]}
            </CardBody>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">Nearest Charger Location</h4>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2 opacity-70">
              Latitude: {nearestCoordinate[0]}
              <br />
              Longtitude: {nearestCoordinate[1]}
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
              {/* <p> Testing Comment</p>
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
              <p> Testing Comment</p> */}
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
