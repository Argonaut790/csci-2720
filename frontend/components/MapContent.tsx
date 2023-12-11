import { useState, useRef, useEffect } from "react";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import { LOCATIONS } from "@components/UpdateData";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import axios from "axios";
import NearestCharger from "@components/NearestCharger";
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
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "purple",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 3,
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

    infowindow.open(map, marker);

    // marker.addListener("click", (e: React.FormEvent<HTMLFormElement>) => {
    //   infowindow.open(map, marker);
    // });
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
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "black",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
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
  const ref = useRef<HTMLDivElement | null>(null);
  const DEFAULT_CENTER = { lat: 22.375267, lng: 114.145151 };
  const DEFAULT_ZOOM = 11;
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
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });
      // Displays single markers on map when called
      addLocationMarker({ locations, map });
      addChargerMarker({ map });
    }

    console.log("location set");
  }, [ref, locations]);

  return (
    <div
      ref={ref}
      style={{ width: "900px", height: "600px" }}
      className=" rounded "
    />
  );
};

const MapContent = () => {
  return (
    <div className="w-100 mx-auto max-w-7xl overflow-hidden">
      {/* <h1>Content</h1> */}
      <div className="flex flex-row justify-center gap-8">
        {/* <div
          id="map"
          className="w-[768px] h-[512px] border aspect-video rounded z-10"
        ></div> */}
        <div>
          <h1 className=" text-4xl"> Introduction</h1>
        </div>
        <GoogleMapsWrapper>
          <GoogleMaps locations={LOCATIONS} />
        </GoogleMapsWrapper>
      </div>
      <NearestCharger />
    </div>
  );
};

export default MapContent;
