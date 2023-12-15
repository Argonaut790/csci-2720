import { useState, useRef, useEffect } from "react";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import { LOCATIONS } from "@components/UpdateData";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import axios from "axios";
import NearestCharger from "@components/NearestCharger";
import DistrictMap from "@components/DistrictMap";
import TableInTest from "@components/tableInTest/table";
import { useUserSystem } from "@/contexts/UserSystemContext";
import UserCRUD from "@components/UserCRUD";
import { useAllDataPoints } from "@/contexts/AllDataPointsContext";
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
    fillColor: "purple",
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

const addChargerMarker = ({
  map,
}: {
  map: google.maps.Map | null | undefined;
}) => {
  axios
    .get(process.env.NEXT_PUBLIC_DEV_API_PATH + "data")
    .then((res) => {
      console.log(res.data);

      const svgMarker = {
        path: "M22,2V4H20V2H18V6a2,2,0,0,0,2,2V18a1,1,0,0,1-1,1H16V11H13V9h3V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V9H3v2H0V24H16V21h3a3,3,0,0,0,3-3V8a2,2,0,0,0,2-2V2ZM10.772,11.426,9.008,14.959l-1.789-.893L8.75,11H6.615A1.614,1.614,0,0,1,5.07,8.917L7.293,4.756l1.76.949L7.275,9H9.4a1.6,1.6,0,0,1,1.376,2.426Z",
        fillColor: "black",
        fillOpacity: 0.6,
        strokeWeight: 2,
        rotation: 0,
        scale: 1,
        anchor: new google.maps.Point(0, 20),
      };

      // from res.data only filter out the lat-long
      const locations: ReadonlyArray<google.maps.LatLngLiteral> = res.data.map(
        (position: data) => {
          return { lat: position["lat-long"][0], lng: position["lat-long"][1] };
        }
      );

      const markers = locations.map((position) => {
        let marker = new google.maps.Marker({
          position: position,
          icon: svgMarker,
          draggable: false,
          optimized: true,
          map: map,
        });
        return marker;
        // // info window
        // let infowindow = new google.maps.InfoWindow({
        //   content: `<div class=" h-4 font-bold text-black">${position.info}</div>`, // 支援html
        // });

        // marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
        //   infowindow.open(map, marker);
        // });
      });

      new MarkerClusterer({ markers, map });
    })
    .catch((err) => {
      console.log(err);
    });
};

const GoogleMaps = ({
  locations,
  className,
}: {
  locations: Props[];
  className?: string;
}) => {
  const { centerPoint, zoomRate } = useAllDataPoints();

  const ref = useRef<HTMLDivElement | null>(null);
  const [curCoordinate, setCurCoordinate] = useState([
    22.419373049191574, 114.20637130715477,
  ]);

  useEffect(() => {
    //user location
    navigator.geolocation.getCurrentPosition((position) => {
      setCurCoordinate([position.coords.latitude, position.coords.longitude]);
      console.log("Get User Location");
      console.log(curCoordinate);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 6000);
    });
    return;
  }, []);

  useEffect(() => {
    // Display the map
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: { lat: centerPoint[0], lng: centerPoint[1] },
        zoom: zoomRate,
      });
      // Displays single markers on map when called
      addLocationMarker({ locations, map });
      addChargerMarker({ map });
    }

    console.log("location set");
  }, [ref, locations, centerPoint]);

  return (
    <div
      ref={ref}
      style={{ width: "100%" }}
      className=" rounded-2xl aspect-video shadow-lg"
    />
  );
};

const AllDataPoints = () => {
  return (
    <div className="flex flex-col gap-6 max-h-screen">
      <h1 className=" text-4xl"> All Data Points</h1>
      <div className="">
        <GoogleMapsWrapper>
          <GoogleMaps locations={LOCATIONS} />
        </GoogleMapsWrapper>
      </div>
    </div>
  );
};

const MapContent = () => {
  const { isadmin } = useUserSystem();

  return (
    <div className="w-100 mx-auto max-w-7xl flex flex-col gap-8">
      <AllDataPoints />
      <TableInTest />
      <DistrictMap />
      <NearestCharger />
      {isadmin && <UserCRUD />}
    </div>
  );
};

export default MapContent;
