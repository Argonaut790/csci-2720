import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import Loading from "@components/Loading";
import axios from "axios";
import { GetNearestCharger } from "@components/NearestCharger";
import { set } from "react-hook-form";
import NearestCharger from "../components/NearestCharger";

interface Props {
  children?: ReactNode;
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

interface NearestChargerContextValue {
  userMarker: google.maps.Marker | null;
  nearestChargerMarker: google.maps.Marker | null;
  curCoordinate: number[];
  nearestCoordinate: number[];
  extraInfo: data | null;
  setUserMarker: Dispatch<SetStateAction<google.maps.Marker | null>>;
  setNearestChargerMarker: Dispatch<SetStateAction<google.maps.Marker | null>>;
  setCurCoordinate: Dispatch<SetStateAction<number[]>>;
  setNearestCoordinate: Dispatch<SetStateAction<number[]>>;
  setExtraInfo: Dispatch<SetStateAction<data | null>>;
}

const NearestChargerContext = createContext<NearestChargerContextValue>(
  {} as NearestChargerContextValue
);
//global method of passing variable to provent param drill in every layer

export const useNearestCharger = () => useContext(NearestChargerContext);

export const NearestChargerProvider = ({ children }: Props) => {
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [nearestChargerMarker, setNearestChargerMarker] = useState<google.maps.Marker | null>(null);
  const [curCoordinate, setCurCoordinate] = useState<number[]>([22.418194, 114.207444]);
  const [nearestCoordinate, setNearestCoordinate] = useState<number[]>([]);
  const [extraInfo, setExtraInfo] = useState<data | null>(null);

  useEffect(() => {
    //user location
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      console.log("Get User Location");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Get User Location Success");
        console.log(position.coords.latitude, position.coords.longitude);
        setCurCoordinate([position.coords.latitude, position.coords.longitude]);

        //get nearest charger location from
        GetNearestCharger(position.coords.latitude, position.coords.longitude)
          .then((result) => {
            setNearestCoordinate(result["lat-long"]);
            console.log("Context Updated the NearestCoor " + result["lat-long"]);
            setExtraInfo(result);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, []);

  const contextValue: NearestChargerContextValue = {
    userMarker,
    nearestChargerMarker,
    curCoordinate,
    nearestCoordinate,
    extraInfo,
    setUserMarker,
    setNearestChargerMarker,
    setCurCoordinate,
    setNearestCoordinate,
    setExtraInfo,
  };

  return (
    <NearestChargerContext.Provider value={contextValue}>{children}</NearestChargerContext.Provider>
  );
};
