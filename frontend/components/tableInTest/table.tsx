import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Modal,
} from "@nextui-org/react";
import { PlusIcon } from "./Pluslcon";
import { VerticalDotsIcon } from "./VerticalDotslcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
// import { columns, statusOptions, data } from "./data";
import { columnsInfo, statusOptions } from "./data";

import { capitalize } from "./utils";
import axios from "axios";
import { useUserSystem } from "@/contexts/UserSystemContext";
const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

// import MapContent from "../MapContent"
import MapView from "./mapView";
interface dataShape {
  _id: { $oid: string };
  "district-s-en": string;
  "location-en": string;
  img: string | null;
  no: string;
  "district-l-en": string;
  "parking-no": string;
  "address-en": string;
  provider: string;
  type: string;
  "lat-long": { $numberDouble: string }[];
  __v: { $numberInt: string };
}
const INITIAL_VISIBLE_COLUMNS = [
  "number",
  "location",
  "parkingNumber",
  "districtSmall",
  "actions",
  "districtLarge",
  "provider",
  "latLong",
  "type",
  "actions",
];

let graph = [
  {
    _id: { $oid: "65794a64df76bc9b7f182716" },
    "district-s-en": "Shatin",
    "location-en": "Hong Kong Science Park",
    img: "/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg",
    no: "19",
    "district-l-en": "New Territories",
    "parking-no": "D042 - D052, D106 - D112",
    "address-en":
      "Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.",
    provider: "CLP",
    type: "SemiQuick",
    "lat-long": [
      { $numberDouble: "22.4262580871582" },
      { $numberDouble: "114.20987701416" },
    ],
    __v: { $numberInt: "0" },
  },
];

type Data = (typeof graph)[0];

// type Data = typeof data[0];
export default function TableInTest() {
  // const [rows, setRows] = React.useState<dataShape[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "no",
    direction: "descending",
  });

  const [data, setData] = React.useState<dataShape[]>([]);
  const [useSorting, setSorting] = React.useState(false);
  const { loggedIn, isadmin } = useUserSystem();

  //open map view
  const [mapView, setMapView] = React.useState(false);

  //for popup edit button

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  //delete function
  const [deleteLoc, setDeleteLoc] = React.useState(false);
  const [reloadData, setReloadData] = React.useState(false);

  //set cases for admin and user
  let columns = {};
  if (isadmin == true) {
    columns = columnsInfo;
  } else if (isadmin == false) {
    columns = [
      { name: "number", uid: "number", sortable: true },
      { name: "location", uid: "location", sortable: true },
      { name: "districtSmall", uid: "districtSmall", sortable: true },
      { name: "districtLarge", uid: "districtLarge", sortable: true },
      { name: "parkingNumber", uid: "parkingNumber", sortable: true },
      { name: "provider", uid: "provider" },
      { name: "latLong", uid: "latLong" },
      { name: "ACTIONS", uid: "actions" },
    ];
  }

  //retrieve and set data
  React.useEffect(() => {
    const fetchData = async () => {
      let result = await axios.get(
        process.env.NEXT_PUBLIC_DEV_API_PATH + "data"
      );

      setData(result.data);
    };

    fetchData();
    console.log("i am fetch data");
    // console.log("rows", rows)
  }, [reloadData]);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (data) =>
          data["location-en"]
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          data["district-s-en"]
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          data["district-l-en"]
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          data["provider"].toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.type)
      );
    }

    console.log("here is the filteredItems", filteredUsers);
    return filteredUsers;
  }, [data, filterValue, statusFilter]);

  React.useEffect(() => {
    setSorting(!useSorting);
  }, [setSortDescriptor]);

  const sortedItems = React.useMemo(() => {
    if (useSorting) {
      let sorted = [...filteredItems].sort((a: Data, b: Data) => {
        let first: string | number =
          a[sortDescriptor.column as keyof Data] || "";
        let second: string | number =
          b[sortDescriptor.column as keyof Data] || "";

        if (sortDescriptor.column === "number") {
          first = Number(a.no);
          second = Number(b.no);
          console.log("first", first);
          console.log("second", second);
        } else if (sortDescriptor.column === "lat-long") {
          first = Number(a["lat-long"][0].$numberDouble);
          second = Number(b["lat-long"][0].$numberDouble);
          console.log("first", first);
          console.log("second", second);
        } else {
          first = first ? first.toString() : "";
          second = second ? second.toString() : "";
          // console.log("first", first)
          // console.log("second", second)
        }

        let cmp: number;

        if (typeof first === "number" && typeof second === "number") {
          cmp = first - second;
        } else {
          cmp = (first as string).localeCompare(second as string);
        }

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });

      console.log("this is sorted", sorted);
      return sorted;
    } else {
      let unsorted = [...filteredItems];
      console.log("unsorted", unsorted);
      return unsorted;
    }
  }, [data, sortDescriptor, filteredItems, hasSearchFilter]);

  console.log("sortedItemsitems", sortedItems);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, filteredItems, sortedItems, rowsPerPage]);

  const deleteLoca = async (no: string) => {
    // console.log("deleting here", no)

    let number = { number: no };
    let response = await axios.post(
      "http://localhost:5500/data/api/deleteData",
      number
    );
    // console.log("repsonse", response.status)
    if (response.status == 200) {
      setReloadData((prevState) => !prevState);
      console.log("delete sucess");
    } else {
      prompt("Some problem with delete");
    }
  };

  const editLoca = async (no: string) => {
    console.log("number to edit is ", no);

    setIsOpenModal1(true);
    setEditNum(no);
  };

  const renderCell = React.useCallback(
    (data: dataShape, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof Data];
      //make latlong to a string
      const latLong = data["lat-long"]
        .map((num: number) => Number(num.toPrecision(4)))
        .join(",");

      console.log("columnKey type:", typeof columnKey);

      switch (columnKey) {
        case "number":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data.no}
              </p>
            </div>
          );
        case "location":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data["location-en"]}
              </p>
            </div>
          );
        case "parkingNumber":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data["parking-no"]}
              </p>
            </div>
          );
        case "districtSmall":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data["district-s-en"]}
              </p>
            </div>
          );
        case "latLong":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {latLong}
              </p>
            </div>
          );
        case "districtLarge":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data["district-l-en"]}
              </p>
            </div>
          );
        case "type":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny capitalize text-default-400">
                {data["type"]}
              </p>
            </div>
          );

        case "actions":
          if (isadmin == true) {
            return (
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem onClick={() => editLoca(data.no)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem onClick={() => deleteLoca(data.no)}>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          } else if (isadmin == false) {
            return (
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem>View</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          }

        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const createButton = () => {
    onOpen();
  };
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {isadmin ? (
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onClick={createButton}
              >
                Create New
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} locations
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    data.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  const updatedDistSmallNameRef = useRef<HTMLInputElement>(null);
  const updatedDistLargeNameRef = useRef<HTMLInputElement>(null);
  const updatedLocationNameRef = useRef<HTMLInputElement>(null);
  const updatedAddressNameRef = useRef<HTMLInputElement>(null);

  const updatedLatitudeRef = useRef<HTMLInputElement>(null);
  const updatedLongitudeRef = useRef<HTMLInputElement>(null);
  const updatedProviderRef = useRef<HTMLInputElement>(null);

  const updatedTypeRef = useRef<HTMLInputElement>(null);

  const updatedParkingNumberRef = useRef<HTMLInputElement>(null);

  const [newCreate, setNewCreate] = useState(false);
  const [submitState, setsubmitState] = useState(false);
  // const [incorrectForm, setincorrectForm] = useState(false)

  const [mapData, setMapData] = useState("");

  const CreateMask = () => {
    const resultRef = useRef<HTMLSpanElement>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedDistSmallName = updatedDistSmallNameRef.current?.value;
      const updatedDistLargeName = updatedDistLargeNameRef.current?.value;
      const updatedAddressName = updatedAddressNameRef.current?.value;
      const updatedLocationName = updatedLocationNameRef.current?.value;
      const updatedLatitude = updatedLatitudeRef.current?.value;
      const updatedLongitude = updatedLongitudeRef.current?.value;
      const updatedProvider = updatedProviderRef.current?.value;
      const updatedType = updatedTypeRef.current?.value;
      const updatedParkingNumber = updatedParkingNumberRef.current?.value;

      let data = {
        newDistSmall: updatedDistSmallName,
        newDistLarge: updatedDistLargeName,
        newDistAddress: updatedAddressName,
        newUpdatedType: updatedType,
        newLocat: updatedLocationName,
        newCoor: [updatedLatitude, updatedLongitude],
        newProvider: updatedProvider,
        newParkingNum: updatedParkingNumber,
      };

      const res = await axios.post(
        "http://localhost:5500/data/api/createNewData",
        data
      );

      if (res.status == 200) {
        setNewCreate(true);
        setsubmitState(true);
      }

      console.log("this is the result", res.data);

      setReloadData((prevState) => !prevState);
    };

    const handleMapData = (lat: number, lng: number) => {
      setMapData({ lat, lng });
      // const [mapView, setMapView] = React.useState(false);
      setMapView(false);

      console.log(
        `Data received from MapView: latitude: ${lat}, longitude: ${lng}`
      );
    };
    const handleClose = () => {
      onClose();
      setsubmitState(false);
    };

    return (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
          onClose={onClose}
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={onSubmit} className="overflwo">
                <ModalHeader className="flex flex-col gap-1">
                  New Location
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="District Small"
                    // defaultValue={editingData?.username}

                    placeholder="eg. shatin"
                    isRequired
                    ref={updatedDistSmallNameRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="District Large"
                    // defaultValue={editingData?.username}

                    placeholder="eg.New Territories"
                    isRequired
                    ref={updatedDistLargeNameRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Location Name"
                    // defaultValue={editingData?.username}

                    placeholder="eg. Hong Kong Science Park"
                    isRequired
                    ref={updatedLocationNameRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Address Name"
                    placeholder="eg. Hong Kong Science Park Carpark P2, B/F,"
                    isRequired
                    ref={updatedAddressNameRef}
                  />
                  <div>Coordinate:</div>
                  {mapData ? (
                    <div className="flex flex-row">
                      <input
                        type="text"
                        className="m-1"
                        value={mapData.lat}
                        ref={updatedLatitudeRef}
                        isRequired
                      />
                      <input
                        type="text"
                        className="m-1"
                        value={mapData.lng}
                        ref={updatedLongitudeRef}
                        isRequired
                      />
                    </div>
                  ) : null}

                  {!mapData ? (
                    <div className="flex flex-row">
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="lat"
                        isRequired
                        ref={updatedLatitudeRef}
                      />
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="long"
                        isRequired
                        ref={updatedLongitudeRef}
                      />
                    </div>
                  ) : null}

                  <Button
                    color="success"
                    variant="light"
                    onClick={() => setMapView(true)}
                  >
                    Select coordinate by Map
                  </Button>
                  <div>
                    {mapView ? (
                      <MapView
                        className="w-full h-64"
                        onMapData={handleMapData}
                      />
                    ) : null}
                  </div>

                  <Input
                    type="text"
                    variant={"underlined"}
                    label="parking number"
                    isRequired
                    ref={updatedParkingNumberRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Type"
                    placeholder="eg. Quick"
                    isRequired
                    ref={updatedTypeRef}
                  />

                  <Input
                    type="text"
                    variant={"underlined"}
                    label="provider"
                    isRequired
                    ref={updatedProviderRef}
                  />

                  {submitState ? (
                    <span ref={resultRef}>result here</span>
                  ) : null}
                  {submitState ? (
                    newCreate ? (
                      <div className="success">success</div>
                    ) : (
                      <div>fail</div>
                    )
                  ) : (
                    <div></div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onClick={handleClose}>
                    Discard
                  </Button>
                  <Button type="submit" color="primary">
                    Submit Change
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };

  const [isOpenModal1, setIsOpenModal1] = useState(false);
  const [editNum, setEditNum] = useState("");

  const updatedDistSmallNameRef1 = useRef<HTMLInputElement>(null);
  const updatedDistLargeNameRef1 = useRef<HTMLInputElement>(null);
  const updatedLocationNameRef1 = useRef<HTMLInputElement>(null);
  const updatedAddressNameRef1 = useRef<HTMLInputElement>(null);

  const updatedLatitudeRef1 = useRef<HTMLInputElement>(null);
  const updatedLongitudeRef1 = useRef<HTMLInputElement>(null);
  const updatedProviderRef1 = useRef<HTMLInputElement>(null);

  const updatedTypeRef1 = useRef<HTMLInputElement>(null);

  const updatedParkingNumberRef1 = useRef<HTMLInputElement>(null);

  const EditMask = () => {
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState("opaque");

    const backdrops = ["opaque", "blur", "transparent"];

    // const handleOpen = (backdrop) => {
    //     setBackdrop(backdrop)

    //     onOpen();
    // }

    const resultRef = useRef<HTMLSpanElement>(null);
    const [fetchedData, setFetchedData] = useState<any>(null);

    const [small, setSmall] = useState();
    const [large, setLarge] = useState();
    const [location, setLocation] = useState();
    const [address, setAddress] = useState();
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [provider, setProvider] = useState();
    const [type, setType] = useState();
    const [parkingNumber, setParkingNumber] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const fetchData = async () => {
        console.log("attention here ", editNum);
        let dataAxios = {
          number: editNum,
        };
        let response = await axios.post(
          "http://localhost:5500/data/api/getSpecficData",
          dataAxios
        );

        let data = response.data;
        console.log("here is the axios data", response.status);
        setFetchedData(data);

        setSmall(data["district-s-en"]);
        setLarge(data["district-l-en"]);
        setLocation(data["location-en"]);
        setAddress(data["address-en"]);
        if (data["lat-long"]) {
          let [lat, long] = data["lat-long"];
          setLatitude(lat);
          setLongitude(long);
        }
        setProvider(data.provider);
        setType(data.type);
        setParkingNumber(data["parking-no"]);
        console.log("THis si here", small); // if (updatedDistLargeNameRef1.current) updatedDistLargeNameRef1.current.value = fetchedData['district-l-en'];
        // if (updatedLocationNameRef1.current) updatedLocationNameRef1.current.value = fetchedData['location-en'];
        // if (updatedAddressNameRef1.current) updatedAddressNameRef1.current.value = fetchedData['address-en'];
        // if (updatedLatitudeRef1.current) updatedLatitudeRef1.current.value = fetchedData['lat-long'][0].toString();
        // if (updatedLongitudeRef1.current) updatedLongitudeRef1.current.value = fetchedData['lat-long'][1].toString();
        // if (updatedProviderRef1.current) updatedProviderRef1.current.value = fetchedData.provider;
        // if (updatedTypeRef1.current) updatedTypeRef1.current.value = fetchedData.type;
        // if (updatedParkingNumberRef1.current) updatedParkingNumberRef1.current.value = fetchedData['parking-no'];

        const timer = setTimeout(() => {
          console.log("This will be logged after 2 seconds");
          setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
      };
      fetchData();
      console.log("fetching");
    }, [isOpenModal1]);

    // useEffect(() => {
    //     if (fetchedData) {
    //         setSmall(fetchedData['district-s-en'])
    //         // if (updatedDistLargeNameRef1.current) updatedDistLargeNameRef1.current.value = fetchedData['district-l-en'];
    //         // if (updatedLocationNameRef1.current) updatedLocationNameRef1.current.value = fetchedData['location-en'];
    //         // if (updatedAddressNameRef1.current) updatedAddressNameRef1.current.value = fetchedData['address-en'];
    //         // if (updatedLatitudeRef1.current) updatedLatitudeRef1.current.value = fetchedData['lat-long'][0].toString();
    //         // if (updatedLongitudeRef1.current) updatedLongitudeRef1.current.value = fetchedData['lat-long'][1].toString();
    //         // if (updatedProviderRef1.current) updatedProviderRef1.current.value = fetchedData.provider;
    //         // if (updatedTypeRef1.current) updatedTypeRef1.current.value = fetchedData.type;
    //         // if (updatedParkingNumberRef1.current) updatedParkingNumberRef1.current.value = fetchedData['parking-no'];
    //         setSmall(fetchedData['district-s-en']);
    //         setLarge(fetchedData['district-l-en']);
    //         setLocation(fetchedData['location-en']);
    //         setAddress(fetchedData['address-en']);
    //         setLatitude(fetchedData['lat-long'][0]);
    //         setLongitude(fetchedData['lat-long'][1]);
    //         setProvider(fetchedData.provider);
    //         setType(fetchedData.type);
    //         setParkingNumber(fetchedData['parking-no']);
    //         console.log("THis si here", small)

    //     }

    // }, [fetchedData])
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedDistSmallName = updatedDistSmallNameRef1.current?.value;
      const updatedDistLargeName = updatedDistLargeNameRef1.current?.value;
      const updatedAddressName = updatedAddressNameRef1.current?.value;
      const updatedLocationName = updatedLocationNameRef1.current?.value;
      const updatedLatitude = updatedLatitudeRef1.current?.value;
      const updatedLongitude = updatedLongitudeRef1.current?.value;
      const updatedProvider = updatedProviderRef1.current?.value;
      const updatedType = updatedTypeRef1.current?.value;
      const updatedParkingNumber = updatedParkingNumberRef1.current?.value;

      let data = {
        newDistSmall: updatedDistSmallName,
        newDistLarge: updatedDistLargeName,
        newDistAddress: updatedAddressName,
        newUpdatedType: updatedType,
        newLocat: updatedLocationName,
        newCoor: [updatedLatitude, updatedLongitude],
        newProvider: updatedProvider,
        newParkingNum: updatedParkingNumber,
      };
      // for (let key in data) {
      //     if (data[key] === undefined || data[key] === null || data[key] === '') {

      //         setincorrectForm(true)

      //         console.log("wrongg!!!!!")

      //         return;

      //     }
      // }

      // axios.post(process.env.NEXT_PUBLIC_DEV_API_PATH + "api/createNewData", data).then((res) => {
      //     console.log("this is the result", res)
      // })

      const res = await axios.post(
        "http://localhost:5500/data/api/createNewData",
        data
      );

      if (res.status == 200) {
        setNewCreate(true);
        setsubmitState(true);
      }

      console.log("this is the result", res.data);

      setReloadData((prevState) => !prevState);
    };

    const handleMapData = (lat: number, lng: number) => {
      setMapData({ lat, lng });
      // const [mapView, setMapView] = React.useState(false);
      setMapView(false);

      console.log(
        `Data received from MapView: latitude: ${lat}, longitude: ${lng}`
      );
    };
    const handleClose = () => {
      onClose();
      setsubmitState(false);
      setIsOpenModal1(false);
    };
    return (
      <>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {/* <Button
                        key={"opaque"}
                        onPress={() => handleOpen("opaque")}
                        className="capitalize"
                    >
                        Edit
                    </Button> */}
            </div>
            <Modal backdrop="opaque" isOpen={isOpenModal1} onClose={onClose}>
              <ModalContent>
                {(onClose) => (
                  <form onSubmit={onSubmit} className="overflwo">
                    <ModalHeader className="flex flex-col gap-1">
                      New Location
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="District Small"
                        defaultValue={small}
                        placeholder={small}
                        isRequired
                        ref={updatedDistSmallNameRef1}
                      />
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="District Large"
                        // defaultValue={editingData?.username}

                        placeholder="eg.New Territories"
                        isRequired
                        ref={updatedDistLargeNameRef}
                      />
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="Location Name"
                        // defaultValue={editingData?.username}

                        placeholder="eg. Hong Kong Science Park"
                        isRequired
                        ref={updatedLocationNameRef}
                      />
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="Address Name"
                        placeholder="eg. Hong Kong Science Park Carpark P2, B/F,"
                        isRequired
                        ref={updatedAddressNameRef}
                      />

                      <div>Coordinate:</div>

                      {mapData ? (
                        <div className="flex flex-row">
                          <input
                            type="text"
                            className="m-1"
                            value={mapData.lat}
                            ref={updatedLatitudeRef}
                            isRequired
                          />
                          <input
                            type="text"
                            className="m-1"
                            value={mapData.lng}
                            ref={updatedLongitudeRef}
                            isRequired
                          />
                        </div>
                      ) : null}

                      {!mapData ? (
                        <div className="flex flex-row">
                          <Input
                            type="text"
                            variant={"underlined"}
                            label="lat"
                            isRequired
                            ref={updatedLatitudeRef}
                          />
                          <Input
                            type="text"
                            variant={"underlined"}
                            label="long"
                            isRequired
                            ref={updatedLongitudeRef}
                          />
                        </div>
                      ) : null}

                      <Button
                        color="success"
                        variant="light"
                        onClick={() => setMapView(true)}
                      >
                        Select coordinate by Map
                      </Button>

                      <div>
                        {mapView ? (
                          <MapView
                            className="w-full h-64"
                            onMapData={handleMapData}
                          />
                        ) : null}
                      </div>

                      <Input
                        type="text"
                        variant={"underlined"}
                        label="parking number"
                        isRequired
                        ref={updatedParkingNumberRef}
                      />
                      <Input
                        type="text"
                        variant={"underlined"}
                        label="Type"
                        placeholder="eg. Quick"
                        isRequired
                        ref={updatedTypeRef}
                      />

                      <Input
                        type="text"
                        variant={"underlined"}
                        label="provider"
                        isRequired
                        ref={updatedProviderRef}
                      />

                      {submitState ? (
                        <span ref={resultRef}>result here</span>
                      ) : null}
                      {submitState ? (
                        newCreate ? (
                          <div className="success">success</div>
                        ) : (
                          <div>fail</div>
                        )
                      ) : (
                        <div></div>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onClick={handleClose}
                      >
                        Discard
                      </Button>
                      <Button type="submit" color="primary">
                        Submit Change
                      </Button>
                    </ModalFooter>
                  </form>
                )}
              </ModalContent>
            </Modal>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <CreateMask />
      <EditMask />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.uid === "number" ? true : false}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody emptyContent={"No users found"} items={items}>
          {(item) => (
            <TableRow key={item["no"]}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
