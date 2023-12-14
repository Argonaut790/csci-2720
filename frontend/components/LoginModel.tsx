import { useState, useRef } from "react";
import axios from "axios";
import { Input, Button, Card, CardBody, toggle } from "@nextui-org/react";
import { useUserSystem } from "@/contexts/UserSystemContext";
import Cookies from "js-cookie";
import updateData from "@/components/UpdateData";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { set } from "react-hook-form";
import { useEffect } from "react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "./icons";

const LoginModal = () => {
  //useref for email and password
  const { theme } = useTheme();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailResult, setEmailResult] = useState<string>("");
  const [passwordResult, setPasswordResult] = useState<string>("");

  //   const navigate = useNavigate();
  //   const result = document.getElementById("result")!;
  const {
    toggleLoadingOn,
    toggleLoadingOff,
    toggleSignUpModalOn,
    toggleForgotPasswordModalOn,
    toggleLoggedInOn,
    toggleIsAdminOn,
    setLoginUser,
  } = useUserSystem();

  const login = () => {
    Cookies.set("email", emailRef.current!.value);
    const user = {
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    };

    toggleLoadingOn();
    axios
      .post(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/login", user)
      .then((res) => {
        if (res.status === 200) {
          setEmailResult("");
          setPasswordResult("");
          Cookies.set("loggedIn", "true");
          Cookies.set("userId", res.data.userId);

          if (res.data.isAdmin) {
            Cookies.set("isAdmin", "true");
            toggleIsAdminOn();
          } else {
            Cookies.set("isAdmin", "false");
          }

          setTimeout(() => {
            toggleLoggedInOn();
            toggleLoadingOff();
            setLoginUser(res.data.username);
          }, 1000);

          const welcomemsg = "Login Success! Welcom, " + res.data.username;
          toast.success(welcomemsg, {
            position: "bottom-right",
            autoClose: 900,
            hideProgressBar: false,
            theme: theme == "light" ? "light" : "dark",
          });

          // Update Data Database
          updateData();
        }
        return "result from success";
      })
      .catch((err) => {
        console.log(err);

        if (err.response.data === "Wrong password") {
          setEmailResult("");
          setPasswordResult("Incorrect Password");
          toast.error("Incorrect password", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            theme: theme == "light" ? "light" : "dark",
          });
        } else {
          setEmailResult("Please input valid email");
          setPasswordResult("Please input valid password");
          toast.error("Incorrect Email or Password", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            theme: theme == "light" ? "light" : "dark",
          });
        }
        toggleLoadingOff();
        return "result from error";
      });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    console.log(email, password);
    if (email === null || email === "") {
      setEmailResult("Please enter an email");
    }

    if (password === null || password === "") {
      setPasswordResult("Please enter a password");
    }

    if (email !== "" && password !== "") {
      login();
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    // <Card>
    <div className="p-8 w-[350px]">
      <form className="flex flex-col gap-4 items-center" onSubmit={onSubmit}>
        <Input
          // isRequired
          type="email"
          variant={"underlined"}
          label="Email"
          ref={emailRef}
          onFocus={() => setEmailResult("")}
          errorMessage={emailResult}
          // className="pb-4"
        />

        <Input
          // isRequired
          variant={"underlined"}
          label="Password"
          ref={passwordRef}
          onFocus={() => setPasswordResult("")}
          errorMessage={passwordResult}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          // className="pb-4"
        />
        <div className="w-full opacity-80 flex justify-between text-sm">
          Don&apos;t have an account?{" "}
          <span
            className=" text-sky-600 underline hover:cursor-pointer hover:font-semibold"
            onClick={() => toggleSignUpModalOn()}
          >
            Sign Up here
          </span>
        </div>
        <Button variant="faded" type="submit" size="md" className="w-full">
          Login
        </Button>

        {/* <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Login"
            className="btn btn-outline-warning"
          />
        </div> */}
      </form>
      <div className="d-grid gap-1 pt-2">
        {/* <button className="btn btn-light" onClick={handleForgotPassword}>
          Forgot Password?
        </button> */}
        {/* <span id="result" ref={resultRef}></span> */}
      </div>
    </div>
  );
};
// forgot password button ||
export default LoginModal;
