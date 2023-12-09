import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import "leaflet/dist/leaflet.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import LoadingMask from './Loading'
import Loading from "./Loading";
const MapContent = () => {
  // const curCoorRef = useRef<HTMLInputElement>(null);


  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0]);
  // const [curCoordinate, setCurCoordinate] = useState<[number, number]>([0, 0]);
  const [curCoordinate, setCurCoordinate] = useState<L.LatLngTuple>([0, 0]);
  const [autolocation, setAutolocation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);


  const mapRef = useRef<L.Map | null>(null);
  const lastMarkRef = useRef<L.Marker | null>(null);
  const autoLocationRef = useRef<L.Marker | null>(null);
  const nearestLocationRef = useRef<L.Marker[]>([]);
  useEffect(() => {
    console.log('useEffect was called');
    if (typeof window !== "undefined") {
      const mapContainer = document.getElementById("map");

      if (!mapContainer || mapContainer._leaflet_id) {
        console.log("Map container not found");
        return;
      }

      mapRef.current = L.map("map").setView(
        [22.419373049191574, 114.20637130715477],
        13
      );
      let map = mapRef.current
      L.tileLayer(
        "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=mPq3AnroIXXtCPXyx40m",
        {
          minZoom: 11,
          maxZoom: 20,
          attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        }
      ).addTo(map);

      let customIcon = L.divIcon({
        className: 'custom-icon',
        html: `<i class="${faMapMarkerAlt}"></i>`,
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
      });

      // map.on('click', function (e) {
      //   L.marker(e.latlng, { icon: customIcon }).addTo(map);
      // });

      let blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // let lastMarker = lastMarkRef.current;



      map.on('click', function (e) {
        clearAutoLocation()
        setAutolocation(false)
        if (autoLocationRef.current) {
          map.removeLayer(autoLocationRef.current);
        }

        if (autolocation == false) {
          if (lastMarkRef.current) {
            map.removeLayer(lastMarkRef.current);
          }
          lastMarkRef.current = L.marker(e.latlng, { icon: blueIcon }).addTo(map)
          let location = lastMarkRef.current.getLatLng();
          console.log(location);
          let latitude = e.latlng.lat;
          let longitude = e.latlng.lng;
          // curCoorRef.current!.innerText = " Here it is "
          setCoordinate([latitude, longitude]);
        }
      });




      //user location
      navigator.geolocation.getCurrentPosition(function (position) {
        let userLocation: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setCurCoordinate([position.coords.latitude, position.coords.longitude])
        console.log("location set")
        setTimeout(() => {
          setLoading(false);
        }, 6000)

      });

    }
  }, []);


  const findNearPowerStation = async () => {
    let map = mapRef.current
    let lastMarker = lastMarkRef.current

    if (autolocation == false) {
      setAutolocation(true)

      if (map && lastMarker) {
        console.log("remmooooovov")
        map.removeLayer(lastMarker);
      }
      console.log("cureent coordinate", curCoordinate)
      if (!mapRef.current) return;
      console.log("cureent coordinate", curCoordinate)
      let userLocation = curCoordinate//[curCoordinate[0], curCoordinate[1]]
      let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      autoLocationRef.current = L.marker(userLocation, { icon: redIcon }).addTo(mapRef.current)
      console.log(autoLocationRef.current)
      let url = `https://api.data.gov.hk/v1/nearest-clp-electric-vehicle-charging-stations?lat=${userLocation[0]}&long=${userLocation[1]}`
      console.log(url)
      let nearestResult = await axios
        .get(url)
        .then((res) => {
          console.log("response is ", res.data.results)
          return res.data.results.slice(0, 10)
        })
      console.log(nearestResult)

      for (let i = 0; i < 10; i++) {
        let onLocation = nearestResult[i]['lat-long']
        let greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        nearestLocationRef.current[i] = L.marker(onLocation, { icon: greenIcon }).addTo(mapRef.current)

      }

    }
    else { console.log("double clicked") }
  }


  const clearAutoLocation = async () => {

    nearestLocationRef.current.forEach(marker => {
      marker.remove();
    });
    nearestLocationRef.current = [];
  }

  const findSpecPowerStation = async () => {


    let url = `https://api.data.gov.hk/v1/nearest-clp-electric-vehicle-charging-stations?lat=${coordinate[0]}&long=${coordinate[1]}`

    let nearestResult = await axios
      .get(url)
      .then((res) => {
        console.log("response is ", res.data.results)
        return res.data.results.slice(0, 10)
      })
    console.log(nearestResult)

    for (let i = 0; i < 10; i++) {
      let onLocation = nearestResult[i]['lat-long']
      let greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      if (mapRef.current !== null) {
        nearestLocationRef.current[i] = L.marker(onLocation, { icon: greenIcon }).addTo(mapRef.current)

      }

    }



  }

  return (
    <div className="w-100 mx-auto max-w-7xl overflow-hidden">

      <div className="relative">
        {/* {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-75">
          <Loading />
          </div>
        )} */}

        <div className="flex flex-row justify-center">
          <div
            id="map"
            className="w-[768px] h-[512px] border aspect-video rounded"
          ></div>

          <div className="px-10 flex flex-col gap-4 w-[260px] justify-center items-center">
            <Input
              type="number"
              label="Latitude"
              placeholder="22.419373049191574"
              value="22.419373049191574"
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
              value="114.20637130715477"
              labelPlacement="outside"
            // endContent={
            //   <div className="pointer-events-none flex items-center">
            //     <span className="text-default-400 text-small">$</span>
            //   </div>
            // }
            />
            <div className="text-white">You are now pointing at:</div>
            <div className="text-white">Latitude: {coordinate[0]}</div>
            <div className="text-white">Longitude: {coordinate[1]}</div>
            <Button variant="faded" size="md" className="" onClick={() => findNearPowerStation()}>
              find nearby powerstation
            </Button>
            <Button variant="faded" size="md" className="" onClick={() => findSpecPowerStation()}>
              find specific location powerstation
            </Button>

          </div>
        </div>

      </div>

    </div>
  );
};

export default MapContent;
