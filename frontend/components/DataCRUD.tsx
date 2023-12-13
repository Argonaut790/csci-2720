import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

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

const DataCRUD = () => {
  const [rows, setRows] = useState<data[]>([]);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "data").then((res) => {
      setRows(res.data);
    });
  }, []);

  const columns = [
    { key: "no", label: "Number" },
    { key: "location-en", label: "Location" },
    { key: "district-s-en", label: "District Small" },
    // { key: "img", label: "Image" },
    { key: "district-l-en", label: "District Large" },
    { key: "parking-no", label: "Parking Notes" },
    { key: "address-en", label: "Address" },
    { key: "provider", label: "Provider" },
    { key: "type", label: "Type" },
    { key: "lat-long", label: "Latitude and Longtitude" },
  ];

  return (
    <div className="py-8">
      <Table
        isStriped
        removeWrapper
        aria-label="Example table with dynamic content"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page: number) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.no}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "lat-long" ? (
                    <>
                      <div>[ {item[columnKey][0]} ,</div>
                      <div>{item[columnKey][1]} ]</div>
                    </>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>





    </div>
  );
};

export default DataCRUD;
