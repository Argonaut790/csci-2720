import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { LOCATIONS } from "@components/UpdateData";
import axios from "axios";
import { set } from "react-hook-form";
import { useDistrictCharger } from "@/contexts/DistrictChargerContext";

interface Props {
  lat: number;
  lng: number;
  info: string;
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
  locations,
  map,
}: {
  locations: Props[];
  map: google.maps.Map | null | undefined;
}) => {
  const svgMarker = {
    path: "M22,2V4H20V2H18V6a2,2,0,0,0,2,2V18a1,1,0,0,1-1,1H16V11H13V9h3V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9H3v2H0V24H16V21h3a3,3,0,0,0,3-3V8a2,2,0,0,0,2-2V2ZM10.772,11.426,9.008,14.959l-1.789-.893L8.75,11H6.615A1.614,1.614,0,0,1,5.07,8.917L7.293,4.756l1.76.949L7.275,9H9.4a1.6,1.6,0,0,1,1.376,2.426Z",
    fillColor: "red",
    fillOpacity: 1,
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };

  locations.map((position) => {
    let marker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      icon: svgMarker,
      draggable: false,
      map: map,
    });

    // info window
    let infowindow = new google.maps.InfoWindow({
      content: `<div class=" h-4 font-bold text-black">${position.info}</div>`, // 支援html
    });

    // infowindow.open(map, marker);

    marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
      infowindow.open(map, marker);
    });
  });
};

const GoogleMaps = ({
  locations,
  center,
  addChargerMarker,
  className,
}: {
  locations: Props[];
  center: { lat: number; lng: number };
  addChargerMarker: any;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const DEFAULT_ZOOM = 14;

  useEffect(() => {
    // Display the map
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: center,
        zoom: DEFAULT_ZOOM,
      });
      addLocationMarker({ locations, map });
      addChargerMarker({ map });
    }

    console.log("location set");
  }, [ref, center]);

  return (
    <div
      ref={ref}
      style={{ width: "100%" }}
      className=" rounded-2xl aspect-video shadow-lg"
    />
  );
};

const DistrictMap = () => {
  const {
    selectedDistrict,
    setSelectedDistrict,
    center,
    setCenter,
    selectedCharger,
    setSelectedCharger,
  } = useDistrictCharger();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
  };

  const addChargerMarker = ({
    map,
  }: {
    map: google.maps.Map | null | undefined;
  }) => {
    axios
      .get(
        process.env.NEXT_PUBLIC_DEV_API_PATH +
          "data/district?" +
          "district=" +
          selectedDistrict
      )
      .then((res) => {
        console.log(res.data);

        const svgMarker = {
          path: "M22,2V4H20V2H18V6a2,2,0,0,0,2,2V18a1,1,0,0,1-1,1H16V11H13V9h3V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9H3v2H0V24H16V21h3a3,3,0,0,0,3-3V8a2,2,0,0,0,2-2V2ZM10.772,11.426,9.008,14.959l-1.789-.893L8.75,11H6.615A1.614,1.614,0,0,1,5.07,8.917L7.293,4.756l1.76.949L7.275,9H9.4a1.6,1.6,0,0,1,1.376,2.426Z",
          fillColor: "blue",
          fillOpacity: 0.8,
          strokeWeight: 2,
          rotation: 0,
          scale: 1.4,
          anchor: new google.maps.Point(0, 20),
        };

        const infowindows: google.maps.InfoWindow[] = [];
        const markers = res.data.map((positionData: data) => {
          let marker = new google.maps.Marker({
            position: {
              lat: positionData["lat-long"][0],
              lng: positionData["lat-long"][1],
            },
            icon: svgMarker,
            draggable: false,
            optimized: true,
            map: map,
          });

          // info window
          let infowindow = new google.maps.InfoWindow({
            content: `<div class=" h-4 font-bold text-black">Selected Charger</div>`, // 支援html
          });

          infowindows.push(infowindow);

          marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
            CloseAllInfoWindow();
            infowindow.open(map, marker);
            setSelectedCharger(positionData);
          });

          return marker;
        });

        const CloseAllInfoWindow = () => {
          for (let i = 0; i < infowindows.length; i++) {
            infowindows[i].close();
          }
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(selectedDistrict);
    LOCATIONS.map((location) => {
      if (location.info === selectedDistrict) {
        setCenter({ lat: location.lat, lng: location.lng });
      }
    });
  }, [selectedDistrict]);

  return (
    <div className=" flex flex-col gap-6 max-h-screen">
      <h1 className=" text-4xl flex justify-end">Get Charger by District</h1>
      <div className="flex flex-row">
        <div className="w-1/3 flex justify-center items-center">
          <Select
            onChange={handleSelectionChange}
            label="Select a district"
            className="max-w-xs"
            variant="bordered"
            defaultSelectedKeys={["Shatin"]}
            description="Click the Charger to get more information"
          >
            {LOCATIONS.map((location) => (
              <SelectItem key={location.info} value={location.info}>
                {location.info}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className=" w-2/3">
          <GoogleMapsWrapper>
            <GoogleMaps
              locations={LOCATIONS}
              center={center}
              addChargerMarker={addChargerMarker}
            />
          </GoogleMapsWrapper>
        </div>
      </div>
      <div className=" grid grid-cols-3 gap-6 h-[250px]">
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">
              Selected Charger's Location
            </h4>
          </CardHeader>
          <Divider />
          <CardBody className="overflow-visible py-2 opacity-70">
            Latitude: {selectedCharger?.["lat-long"][0] || "None"}
            <br />
            Longtitude: {selectedCharger?.["lat-long"][1] || "None"}
          </CardBody>
        </Card>
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">More Info</h4>
          </CardHeader>
          <Divider />
          <CardBody className="overflow-visible py-2 opacity-70">
            <span>Location: {selectedCharger?.["location-en"] || "None"}</span>
            <span>Address: {selectedCharger?.["address-en"] || "None"}</span>
            <span>
              District: {selectedCharger?.["district-s-en"] || "None"}
            </span>
            <span>
              Parking Notes: {selectedCharger?.["parking-no"] || "None"}
            </span>
            <span>Provider: {selectedCharger?.["provider"] || "None"}</span>
            <span>Type: {selectedCharger?.["type"] || "None"}</span>
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
  );
};

export default DistrictMap;
