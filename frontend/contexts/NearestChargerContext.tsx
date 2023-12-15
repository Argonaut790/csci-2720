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

interface nearestProps {
  "lat-long": number[];
  locationid: string;
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
  nearestCoordinate: nearestProps;
  extraInfo: data | null;
  setUserMarker: Dispatch<SetStateAction<google.maps.Marker | null>>;
  setNearestChargerMarker: Dispatch<SetStateAction<google.maps.Marker | null>>;
  setCurCoordinate: Dispatch<SetStateAction<number[]>>;
  setNearestCoordinate: Dispatch<SetStateAction<nearestProps>>;
  setExtraInfo: Dispatch<SetStateAction<data | null>>;
}

const NearestChargerContext = createContext<NearestChargerContextValue>(
  {} as NearestChargerContextValue
);
//global method of passing variable to provent param drill in every layer

export const useNearestCharger = () => useContext(NearestChargerContext);

export const NearestChargerProvider = ({ children }: Props) => {
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [nearestChargerMarker, setNearestChargerMarker] =
    useState<google.maps.Marker | null>(null);
  const [curCoordinate, setCurCoordinate] = useState<number[]>([]);
  const [nearestCoordinate, setNearestCoordinate] = useState<nearestProps>({
    "lat-long": [],
    locationid: "",
  } as nearestProps);
  const [extraInfo, setExtraInfo] = useState<data | null>(null);

  useEffect(() => {
    //user location
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      console.log("Get User Location");
      navigator.geolocation.getCurrentPosition((position) => {
        setCurCoordinate([position.coords.latitude, position.coords.longitude]);

        //get nearest charger location from
        GetNearestCharger(position.coords.latitude, position.coords.longitude)
          .then((result) => {
            setNearestCoordinate({
              "lat-long": result["lat-long"],
              locationid: result.locationid,
            });
            console.log(
              "Context Updated the NearestCoor " + result["lat-long"]
            );
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
    <NearestChargerContext.Provider value={contextValue}>
      {children}
    </NearestChargerContext.Provider>
  );
};
