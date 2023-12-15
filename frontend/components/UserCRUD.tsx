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
import { toast } from "react-toastify";
import { useUserSystem } from "@/contexts/UserSystemContext";
import { EditIcon, DeleteIcon } from "@components/icons";
import { useTheme } from "next-themes";

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
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const [accounts, setAccounts] = useState<data[]>([]);
  const [targetAccount, setTargetAccount] = useState<data | null>(null);
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const { user, setLoginUser } = useUserSystem();
  const { theme } = useTheme();

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return accounts.slice(start, end);
  }, [page, accounts]);

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account").then((res) => {
      setAccounts(res.data);
    });
  }, []);

  const columns = [
    { key: "username", label: "Username" },
    { key: "password", label: "Password" },
    { key: "email", label: "Email" },
    { key: "isAdmin", label: "Is Admin" },
    { key: "timestamp", label: "Timestamp" },
    { key: "userId", label: "User ID" },
    { key: "actions", label: "Actions" },
  ];

  const handleEditAccount = (user: data) => {
    console.log("Edit: ", user.userId);
    setTargetAccount(user);
    onOpen();
  };

  const handleDeleteAccount = (user: data) => {
    console.log("Delete: ", user.userId);
    axios
      .delete(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + user.userId)
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        axios
          .get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account")
          .then((res) => {
            setAccounts(res.data);
          });
      })
      .then(() => {
        toast.success("Success remove account", {
          position: "bottom-right",
          autoClose: 900,
          hideProgressBar: false,
          theme: theme == "light" ? "light" : "dark",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed remove account", {
          position: "bottom-right",
          autoClose: 900,
          hideProgressBar: false,
          theme: theme == "light" ? "light" : "dark",
        });
      });
  };

  const renderCell = useCallback((item: data, columnKey: keyof data) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={(e) => {
                  handleEditAccount(item);
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={(e) => handleDeleteAccount(item)}
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
  }, []);

  const AddUesr = () => {
    axios
      .post(process.env.NEXT_PUBLIC_DEV_API_PATH + "account")
      .then((res) => {
        console.log(res);
        // setUpdated((prev) => !prev);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const ModalView = () => {
    const usernameFieldRef = useRef<HTMLInputElement>(null);
    const passwordFieldRef = useRef<HTMLInputElement>(null);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const username = usernameFieldRef.current!.value;
      const password = passwordFieldRef.current!.value;

      // Check for the username and password for not empty
      if (username !== "" && password !== "") {
        // Update the user info
        axios
          .patch(
            process.env.NEXT_PUBLIC_DEV_API_PATH +
              "account/" +
              targetAccount!.userId,
            {
              username: username,
              password: password,
            }
          )
          .then((res) => {
            const currentUserId = Cookies.get("userId");
            if (
              targetAccount &&
              currentUserId &&
              currentUserId !== undefined &&
              currentUserId === targetAccount?.userId
            ) {
              console.log("Update sign in user info");
              console.log(username);
              setLoginUser(targetAccount.userId, username);
            }
          })
          .then(() => {
            axios
              .get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account")
              .then((res) => {
                setAccounts(res.data);
              });
          })
          .then(() => {
            toast.success("Success update account", {
              position: "bottom-right",
              autoClose: 900,
              hideProgressBar: false,
              theme: theme == "light" ? "light" : "dark",
            });
          })
          .catch((err) => {
            toast.success("Failed update account", {
              position: "bottom-right",
              autoClose: 900,
              hideProgressBar: false,
              theme: theme == "light" ? "light" : "dark",
            });
            console.log(err);
          });
      }
      onClose();
    };

    return (
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
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Editing {targetAccount?.username} #{targetAccount?.userId}
            </ModalHeader>
            <ModalBody>
              <Input
                type="text"
                variant={"underlined"}
                label="Username"
                defaultValue={targetAccount?.username}
                isRequired
                ref={usernameFieldRef}
              />
              <Input
                type="text"
                variant={"underlined"}
                label="Password"
                defaultValue={targetAccount?.password}
                isRequired
                ref={passwordFieldRef}
              />
              <Input
                type="text"
                variant={"underlined"}
                label="Is Admin"
                value={targetAccount?.isAdmin.toString()}
                className=" opacity-50"
                readOnly
                disabled
              />
              <Input
                // isRequired
                type="email"
                variant={"underlined"}
                label="Email"
                value={targetAccount?.email}
                className=" opacity-50"
                readOnly
                disabled
                // className="pb-4"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div
      id="UserCRUDSection"
      className="flex flex-col gap-6 mt-20 mb-20 w-full relative"
    >
      <ModalView />
      <h1 className="flex justify-start text-7xl lg:h-20 mb-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        User CRUD
      </h1>
      {/* <div className="flex justify-end">
        <Button
          color="secondary"
          size="md"
          variant="bordered"
          onClick={() => AddUesr()}
          // className="bg-gradient-to-tr from-purple-700 to-yellow-700 text-white shadow-lg"
        >
          + User
        </Button>
      </div> */}
      <div className="py-4">
        <Table
          isStriped
          isHeaderSticky
          aria-label="Example table with dynamic content"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={Math.ceil(accounts.length / rowsPerPage)}
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
    </div>
  );
};

export default UserCRUD;
