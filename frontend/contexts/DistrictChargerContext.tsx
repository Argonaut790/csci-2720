import { set } from "react-hook-form";
import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { select } from "@nextui-org/react";

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

interface DistrictChargerContextValue {
  selectedDistrict: string;
  selectedCharger: data | null;
  center: {
    lat: number;
    lng: number;
  };
  setSelectedDistrict: Dispatch<SetStateAction<string>>;
  setSelectedCharger: Dispatch<SetStateAction<data | null>>;
  setCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}

const DistrictChargerContext = createContext<DistrictChargerContextValue>(
  {} as DistrictChargerContextValue
);
//global method of passing variable to provent param drill in every layer

export const useDistrictCharger = () => useContext(DistrictChargerContext);

export const DistrictChargerProvider = ({ children }: Props) => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCharger, setSelectedCharger] = useState<data | null>(null); // [data, setData
  const [center, setCenter] = useState({
    lat: 22.377159870179007,
    lng: 114.19723973287563,
  });

  useEffect(() => {
    setSelectedDistrict("Shatin");
  }, []);

  useEffect(() => {
    console.log(selectedCharger);
  }, [selectedCharger]);

  const contextValue: DistrictChargerContextValue = {
    selectedDistrict,
    selectedCharger,
    center,
    setSelectedDistrict,
    setSelectedCharger,
    setCenter,
  };

  return (
    <DistrictChargerContext.Provider value={contextValue}>
      {children}
    </DistrictChargerContext.Provider>
  );
};
