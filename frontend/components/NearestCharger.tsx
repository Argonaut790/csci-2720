import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import axios from "axios";
import { set } from "react-hook-form";
import { useUserSystem } from "@/contexts/UserSystemContext";
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

const addLocationMarker = ({
  location,
  map,
  color = "red",
  info,
}: {
  location: number[];
  map: google.maps.Map | null | undefined;
  color?: string;
  info?: string;
}) => {
  if (!location) return;

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: color,
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };
  let marker = new google.maps.Marker({
    position: { lat: location[0], lng: location[1] },
    icon: svgMarker,
    draggable: false,
    map: map,
  });

  if (info) {
    // info window
    let infowindow = new google.maps.InfoWindow({
      content: `<div class=" h-4 font-bold text-black">${info}</div>`, // 支援html
    });

    infowindow.open(map, marker);

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

const GoogleMaps = ({ className }: GoogleMapsProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const DEFAULT_ZOOM = 14;
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [renderCounter, setRenderCounter] = useState(0);

  const { curCoordinate, nearestCoordinate } = useUserSystem();

  // Initialize the map
  useEffect(() => {
    if (ref.current) {
      const initialMap = new window.google.maps.Map(ref.current, {
        center: { lat: curCoordinate[0], lng: curCoordinate[1] },
        zoom: DEFAULT_ZOOM,
      });
      setMap(initialMap);
    }
  }, [curCoordinate, ref]);

  // Add markers whenever curCoordinate or nearestCoordinate changes
  useEffect(() => {
    setRenderCounter(renderCounter + 1);
    if (map) {
      console.log("Rendder Counter: " + renderCounter);
      console.log("curCoordinate: " + curCoordinate);
      console.log("nearestCoordinate: " + nearestCoordinate);

      addLocationMarker({
        location: curCoordinate,
        map: map,
        info: "User's Location",
      });
      addLocationMarker({
        location: nearestCoordinate,
        map: map,
        color: "blue",
        info: "Nearest Charger",
      });

      // Create the initial InfoWindow.
      let infoWindow = new google.maps.InfoWindow({
        content: "<div class='text-black'>Click the map to get Lat/Lng!</div>",
        position: { lat: curCoordinate[0], lng: curCoordinate[1] },
      });

      infoWindow.open(map);

      // Configure the click listener.
      map.addListener("click", (mapsMouseEvent: any) => {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
        infoWindow.open(map);
      });
    }
  }, [map, curCoordinate, nearestCoordinate]);

  return <div ref={ref} style={{ width: "900px", height: "600px" }} className=" rounded " />;
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
  const { curCoordinate, nearestCoordinate } = useUserSystem();

  const latRef = useRef<HTMLInputElement | null>(null);
  const lngRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <h1 className=" text-2xl py-4">Nearest Charger</h1>
      <div className=" flex flex-row justify-center">
        <div>
          <GoogleMapsWrapper>
            <GoogleMaps curCoordinate={curCoordinate} nearestCoordinate={nearestCoordinate} />
          </GoogleMapsWrapper>
        </div>
        <div className="px-10 flex flex-col gap-4 w-[260px] justify-center items-center">
          <Input
            type="number"
            label="Latitude"
            placeholder="22.419373049191574"
            value={curCoordinate[0].toString()}
            labelPlacement="outside"
            // endContent={
            //   <div className="pointer-events-none flex items-center">
            //     <span className="text-default-400 text-small">$</span>
            //   </div>
            // }
          />
          <Input
            type="number"
            label="Longtitude"
            placeholder="114.20637130715477"
            value={curCoordinate[1].toString()}
            labelPlacement="outside"
            // endContent={
            //   <div className="pointer-events-none flex items-center">
            //     <span className="text-default-400 text-small">$</span>
            //   </div>
            // }
          />
          <Button>Get Nearest Locations</Button>
        </div>
      </div>
    </>
  );
};

export default NearestCharger;
