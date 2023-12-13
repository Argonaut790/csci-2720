import React from "react";
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
    SortDescriptor
} from "@nextui-org/react";
import { PlusIcon } from "./Pluslcon";
import { VerticalDotsIcon } from "./VerticalDotslcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
// import { columns, statusOptions, data } from "./data";
import { columns, statusOptions } from "./data";

import { capitalize } from "./utils";
import axios from "axios";
const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

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
const INITIAL_VISIBLE_COLUMNS = ["number", "location", "parkingNumber", "districtSmall", "actions"];


let graph = [{ "_id": { "$oid": "65794a64df76bc9b7f182716" }, "district-s-en": "Shatin", "location-en": "Hong Kong Science Park", "img": "/EV/PublishingImages/common/map/map_thumb/Entrance_HK%20Science%20Park_large.jpg", "no": "19", "district-l-en": "New Territories", "parking-no": "D042 - D052, D106 - D112", "address-en": "Hong Kong Science Park Carpark P2, B/F,\n8-10 Science Park West Avenue, Shatin, N.T.", "provider": "CLP", "type": "SemiQuick", "lat-long": [{ "$numberDouble": "22.4262580871582" }, { "$numberDouble": "114.20987701416" }], "__v": { "$numberInt": "0" } },]




type Data = typeof graph[0];

// type Data = typeof data[0];
export default function TableInTest() {
    // const [rows, setRows] = React.useState<dataShape[]>([]);
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "no",
        direction: "descending",
    });

    const [data, setData] = React.useState<dataShape[]>([]);
    const [useSorting, setSorting] = React.useState(false)


    //retrieve and set data


    React.useEffect(() => {
        const fetchData = async () => {
            let result = await axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "data")

            setData(result.data)
        }


        fetchData()
        console.log("i am fetch data")
        // console.log("rows", rows)
    }, []);

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...data];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((data) =>
                data["location-en"].toLowerCase().includes(filterValue.toLowerCase())
                ||
                data["district-s-en"].toLowerCase().includes(filterValue.toLowerCase())
                ||
                data["district-l-en"].toLowerCase().includes(filterValue.toLowerCase()) ||
                data["provider"].toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        console.log("here is the filteredItems", filteredUsers)
        return filteredUsers;
    }, [data, filterValue]);


    React.useEffect(
        () => {
            setSorting(!useSorting)
        }
        , [setSortDescriptor])

    const sortedItems = React.useMemo(() => {

        if (useSorting) {

            let sorted = [...filteredItems].sort((a: Data, b: Data) => {

                let first: string | number = a[sortDescriptor.column as keyof Data] || '';
                let second: string | number = b[sortDescriptor.column as keyof Data] || '';


                if (sortDescriptor.column === 'number') {
                    first = Number(a.no);
                    second = Number(b.no);
                    console.log("first", first)
                    console.log("second", second)
                } else if (sortDescriptor.column === 'lat-long') {
                    first = Number(a['lat-long'][0].$numberDouble);
                    second = Number(b['lat-long'][0].$numberDouble);
                    console.log("first", first)
                    console.log("second", second)
                } else {
                    first = first ? first.toString() : '';
                    second = second ? second.toString() : '';
                    console.log("first", first)
                    console.log("second", second)
                }

                let cmp: number;

                if (typeof first === 'number' && typeof second === 'number') {
                    cmp = first - second;
                } else {
                    cmp = (first as string).localeCompare(second as string);
                }

                return sortDescriptor.direction === "descending" ? -cmp : cmp;

            });

            console.log("this is sorted", sorted)
            return sorted;
        }
        else {
            let unsorted = [...filteredItems]
            console.log("unsorted", unsorted)
            return unsorted
        }

    }, [data, sortDescriptor, filteredItems, hasSearchFilter]);


    console.log("sortedItemsitems", sortedItems)

    const pages = Math.ceil(sortedItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, filteredItems, sortedItems, rowsPerPage]);





    const renderCell = React.useCallback((data: dataShape, columnKey: React.Key) => {
        const cellValue = data[columnKey as keyof Data];
        //make latlong to a string
        const latLong = data["lat-long"].map((num: number) => Number(num.toPrecision(4))).join(",");

        console.log("columnKey type:", typeof columnKey)
        let isadmin = 0
        switch (columnKey) {

            case "number":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{data.no}</p>
                    </div>
                );
            case "location":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{data['location-en']}</p>
                    </div>
                );
            case "parkingNumber":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{data["parking-no"]}</p>
                    </div>
                );
            case "districtSmall":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{data["district-s-en"]}</p>
                    </div>
                );
            case "latLong":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{latLong}</p>
                    </div>
                );
            case "districtLarge":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{data["district-l-en"]}</p>
                    </div>
                );


            case "actions":
                if (isadmin == 1) {
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
                                    <DropdownItem>Edit</DropdownItem>
                                    <DropdownItem>Delete</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                }
                else if (isadmin == 0) {
                    return
                }

            default:
                return cellValue;
        }
    }, []);

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

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

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
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
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
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                        <Button color="primary" endContent={<PlusIcon />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {data.length} locations</span>
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
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);




    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
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
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
