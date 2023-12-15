import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface Props {
  children?: ReactNode;
}

interface AllDataPointsContextValue {
  centerPoint: number[];
  zoomRate: number;
  setCenterPoint: Dispatch<SetStateAction<number[]>>;
  setZoomRate: Dispatch<SetStateAction<number>>;
}

const AllDataPointsContext = createContext<AllDataPointsContextValue>(
  {} as AllDataPointsContextValue
);
//global method of passing variable to provent param drill in every layer

export const useAllDataPoints = () => useContext(AllDataPointsContext);

export const AllDataPointsProvider = ({ children }: Props) => {
  const [centerPoint, setCenterPoint] = useState<number[]>([
    22.36055048544373, 114.12749704182502,
  ]);
  const [zoomRate, setZoomRate] = useState<number>(11);

  const contextValue: AllDataPointsContextValue = {
    centerPoint,
    zoomRate,
    setCenterPoint,
    setZoomRate,
  };

  return (
    <AllDataPointsContext.Provider value={contextValue}>
      {children}
    </AllDataPointsContext.Provider>
  );
};
