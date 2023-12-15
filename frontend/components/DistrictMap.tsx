import { GoogleMapsWrapper } from "@components/GoogleMapWrapper";
import { useEffect, useState, useRef, Key } from "react";
import {
  Button,
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
import { SumbitIcon } from "@components/icons";
import { useUserSystem } from "@/contexts/UserSystemContext";
interface Props {
  lat: number;
  lng: number;
  info: string;
}

interface commentProps {
  userid: string;
  comment: string;
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
  locationid: string;
  comments: {
    userid: string;
    comment: string;
  }[];
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

  const commentRef = useRef<HTMLInputElement | null>(null);
  const [commentsList, setCommentsList] = useState<commentProps[]>([]);
  const { user } = useUserSystem();

  useEffect(() => {
    LOCATIONS.map((location) => {
      if (location.info === selectedDistrict) {
        setCenter({ lat: location.lat, lng: location.lng });
      }
    });
  }, [selectedDistrict]);

  useEffect(() => {
    GetCommentsList();
  }, [selectedCharger]);

  const GetCommentsList = () => {
    // router.get("/comments/:chargerId", async (req: Request, res: Response) => {
    //   try {
    //     const data = await Data.find({ locationid: req.params.chargerId });
    //     res.status(200).json(data[0].comments);
    //   } catch (err) {
    //     res.status(500).send("Failed get comments by chargerId");
    //   }
    // });
    console.log("Hello");
    if (!selectedCharger) {
      return;
    }

    axios
      .get(
        process.env.NEXT_PUBLIC_DEV_API_PATH +
          "data/comments/" +
          selectedCharger?.locationid
      )
      .then((res) => {
        console.log("Comments List: ");
        console.log(res.data);
        setCommentsList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCommentSubmit = () => {
    // router.post("/comments/:chargerId", async (req: Request, res: Response) => {
    //   try {
    //     const updatedData = await Data.updateOne(
    //       { locationid: req.params.chargerId },
    //       {
    //         $push: {
    //           comments: {
    //             userid: req.body.userid,
    //             comment: req.body.comment,
    //           },
    //         },
    //       }
    //     );
    //     console.log(updatedData);
    //     res.status(200).json(updatedData);
    //   } catch (err) {
    //     res.status(500).send("Failed update one data by locationid");
    //   }
    // });
    console.log(user);
    if (!user) {
      return;
    }

    // if content is empty return
    if (!commentRef.current?.value) {
      return;
    }

    if (!selectedCharger) {
      return;
    }

    axios
      .post(
        process.env.NEXT_PUBLIC_DEV_API_PATH +
          "data/comments/" +
          selectedCharger?.locationid,
        {
          userid: user?.userId,
          comment: commentRef.current?.value,
        }
      )
      .then((res) => {
        console.log(res.data);
        GetCommentsList();
        // Clear the input
        commentRef.current!.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCommentSubmit();
    }
  };

  return (
    <div className=" flex flex-col gap-6 max-h-screen">
      <h1 className=" text-4xl flex justify-end">Get Charger by District</h1>
      <div className="flex flex-row">
        <div className="w-1/3 flex flex-col justify-center items-center">
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
          {selectedCharger ? (
            <div className="px-10 pt-8 flex flex-col gap-4 w-11/12 justify-center items-center">
              <Input
                className=""
                type="number"
                label="Latitude"
                // placeholder="22.419373049191574"
                variant="underlined"
                value={selectedCharger?.["lat-long"][0].toString() || "None"}
                labelPlacement="outside"
                readOnly
                disabled
                // ref={latRef}
                // endContent={
                //   <div className="pointer-events-none flex items-center">
                //     <span className="text-default-400 text-small">$</span>
                //   </div>
                // }
              />
              <Input
                className=""
                type="number"
                label="Longtitude"
                // placeholder="114.20637130715477"
                variant="underlined"
                value={selectedCharger?.["lat-long"][1].toString() || "None"}
                labelPlacement="outside"
                readOnly
                disabled
                // ref={lngRef}
                // endContent={
                //   <div className="pointer-events-none flex items-center">
                //     <span className="text-default-400 text-small">$</span>
                //   </div>
                // }
              />
            </div>
          ) : (
            <div></div>
          )}
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
        <Card className="py-4 pb-0">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Favourited Charger</h4>
          </CardHeader>
          <Divider />
          <CardBody className="overflow-visible py-2 opacity-70">
            Latitude: {selectedCharger?.["lat-long"][0] || "None"}
            <br />
            Longtitude: {selectedCharger?.["lat-long"][1] || "None"}
          </CardBody>
        </Card>
        <Card className="py-4 pb-0">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">More Info</h4>
          </CardHeader>
          <Divider />
          {selectedCharger ? (
            <CardBody className="overflow-visible py-2 opacity-70">
              <span>
                Location: {selectedCharger?.["location-en"] || "None"}
              </span>
              <span>Address: {selectedCharger?.["address-en"] || "None"}</span>
              <span>
                District: {selectedCharger?.["district-s-en"] || "None"}
              </span>
              <span>
                Parking Notes: {selectedCharger?.["parking-no"] || "None"}
              </span>
              <span>Provider: {selectedCharger?.["provider"] || "None"}</span>
              <span>Type: {selectedCharger?.["type"] || "None"}</span>
              <span>No: {selectedCharger?.no || "None"}</span>
            </CardBody>
          ) : (
            <CardBody className="py-2 opacity-70 justify-center items-center">
              Select a charger to view details
            </CardBody>
          )}
        </Card>
        <Card className="py-4 h-full pb-0">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Comments</h4>
          </CardHeader>
          <Divider />
          {selectedCharger ? (
            <>
              <CardBody className="overflow-visible py-2 opacity-70 overflow-y-scroll h-full">
                {commentsList.length === 0 && (
                  <div className="flex h-full justify-center items-center">
                    No Comments Yet!
                  </div>
                )}

                {[...commentsList]
                  .reverse()
                  .map((comment: commentProps, key) => (
                    <div className="flex flex-col gap-2" key={key}>
                      <span>
                        #{comment.userid}: {comment.comment}
                      </span>
                      <Divider />
                    </div>
                  ))}
              </CardBody>
              <Divider />
              <CardFooter className=" p-0">
                <Input
                  type="text"
                  label="Comment"
                  // placeholder="Write your Comment"
                  className=" py-4 px-2 "
                  variant="underlined"
                  ref={commentRef}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  isIconOnly
                  aria-label="Submit Comment"
                  variant="faded"
                  onClick={handleCommentSubmit}
                >
                  <SumbitIcon />
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardBody className="py-2 opacity-70 flex justify-center items-center">
              Select a charger to view comments
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DistrictMap;
