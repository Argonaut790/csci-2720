import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  User,
  Chip,
  Tooltip,
  Input,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo, useCallback, useRef, Key } from "react";
// {
//     "_id": "65524b4127cf85ba98a40daa",
//     "username": "Argonaut",
//     "password": "123456",
//     "email": "tung23966373@gmail.com",
//     "isAdmin": true,
//     "timestamp": "2023-11-13T16:13:32.357Z",
//     "userId": "fc996f",
//     "__v": 0
// },

const EditIcon = () => {
  return (
    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 20 20"
        width="1em"
      >
        <path
          d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        ></path>
        <path
          d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        ></path>
        <path
          d="M2.5 18.3333H17.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
        ></path>
      </svg>
    </span>
  );
};

const DeleteIcon = () => {
  return (
    <span className="text-lg text-danger cursor-pointer active:opacity-50">
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 20 20"
        width="1em"
      >
        <path
          d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M8.60834 13.75H11.3833"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M7.91669 10.4167H12.0834"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
      </svg>
    </span>
  );
};

interface data {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  timestamp: string;
  userId: string;
  actions: string;
}

const UserCRUD = () => {
  const [editingRow, setEditingRow] = useState<string | null>(null); // userId
  const [editingData, setEditingData] = useState<data | null>(null);
  const [updated, setUpdated] = useState<boolean>(false); // userId
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const [rows, setRows] = useState<data[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account").then((res) => {
      setRows(res.data);
    });
  }, [updated]);

  useEffect(() => {
    console.log(editingRow);
  }, [editingRow]);

  const columns = [
    { key: "username", label: "Username" },
    { key: "password", label: "Password" },
    { key: "email", label: "Email" },
    { key: "isAdmin", label: "Is Admin" },
    { key: "timestamp", label: "Timestamp" },
    { key: "userId", label: "User ID" },
    { key: "actions", label: "Actions" },
  ];

  const FetchUserInfo = (userId: string) => {
    axios
      .get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + userId)
      .then((res) => {
        console.log(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + userId);
        console.log(res.data);
        setEditingData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteUser = (userId: string) => {
    axios
      .delete(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + userId)
      .then((res) => {
        console.log(res);
        setUpdated((prev) => !prev);
      });
  };

  const renderCell = useCallback(
    (item: data, columnKey: keyof data) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit user">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setEditingRow(item.userId);
                    FetchUserInfo(item.userId);
                    onOpen();
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => DeleteUser(item.userId)}
                >
                  {Cookies.get("userId") != item.userId ? <DeleteIcon /> : ""}
                </span>
              </Tooltip>
            </div>
          );
        default:
          if (typeof cellValue === "boolean") {
            return (
              <span className={cellValue ? " text-green-500" : " text-red-500"}>
                {cellValue.toString()}
              </span>
            );
          } else {
            return <span>{cellValue}</span>;
          }
      }
    },
    [editingRow]
  );

  const EditMask = () => {
    const updatedUserNameRef = useRef<HTMLInputElement>(null);
    const updatedPasswordRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLSpanElement>(null);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const username = updatedUserNameRef.current!.value;
      const password = updatedPasswordRef.current!.value;
      e.preventDefault();

      // Check for the username and password for not empty
      if (username === "" || password === "") {
        resultRef.current!.innerText +=
          "Username and password cannot be empty. ";
      } else {
        // Update the user info
        console.log(
          process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + editingRow
        );
        axios.patch(
          process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + editingRow,
          {
            username: username,
            password: password,
          }
        );
      }
      setEditingData(null);
      setEditingRow(null);
      setUpdated((prev) => !prev);
      onClose();
    };

    return (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
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
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Editing {editingData?.username} #{editingRow}
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Username"
                    defaultValue={editingData?.username}
                    isRequired
                    ref={updatedUserNameRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Password"
                    defaultValue={editingData?.password}
                    isRequired
                    ref={updatedPasswordRef}
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="User ID"
                    value={editingData?.userId}
                    className=" opacity-50"
                    readOnly
                    disabled
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Is Admin"
                    value={editingData?.isAdmin.toString()}
                    className=" opacity-50"
                    readOnly
                    disabled
                  />
                  <Input
                    // isRequired
                    type="email"
                    variant={"underlined"}
                    label="Email"
                    value={editingData?.email}
                    className=" opacity-50"
                    readOnly
                    disabled
                    // className="pb-4"
                  />
                  <Input
                    type="text"
                    variant={"underlined"}
                    label="Timestamp"
                    value={editingData?.timestamp}
                    className=" opacity-50"
                    readOnly
                    disabled
                  />
                  <span ref={resultRef}></span>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
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

  const AddUesr = () => {
    axios
      .post(process.env.NEXT_PUBLIC_DEV_API_PATH + "account")
      .then((res) => {
        console.log(res);
        setUpdated((prev) => !prev);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  return (
    <>
      <EditMask />
      <div className="flex justify-end">
        {/* <Button
          color="secondary"
          size="md"
          variant="bordered"
          onClick={() => AddUesr()}
          // className="bg-gradient-to-tr from-purple-700 to-yellow-700 text-white shadow-lg"
        >
          + User
        </Button> */}
      </div>
      <div className="py-4 ">
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
                onChange={(page) => setPage(page)}
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
              <TableRow key={item.userId}>
                {(columnKey: Key) => (
                  <TableCell>
                    {renderCell(item, columnKey as keyof data)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UserCRUD;
