import React, { useEffect } from "react";
import L from "leaflet";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import "leaflet/dist/leaflet.css";

const MapContent = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mapContainer = document.getElementById("map");

      if (!mapContainer || mapContainer._leaflet_id) {
        console.log("Map container not found");
        return;
      }

      let map = L.map("map").setView(
        [22.419373049191574, 114.20637130715477],
        13
      );
      L.tileLayer(
        "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}@2x.png?key=mPq3AnroIXXtCPXyx40m",
        {
          minZoom: 11,
          maxZoom: 15,
          attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        }
      ).addTo(map);
    }
  }, []);

  return (
    <div className="w-100 mx-auto max-w-7xl overflow-hidden">
      {/* <h1>Content</h1> */}
      <div className="flex flex-row justify-center">
        <div
          id="map"
          className="w-[768px] h-[512px] border aspect-video rounded z-10"
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
        </div>
      </div>
    </div>
  );
};

export default MapContent;
