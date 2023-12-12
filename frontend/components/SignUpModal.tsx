import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useUserSystem } from "@/contexts/UserSystemContext";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";

// interface SignUpModalProps {
//   setShowModal: (show: boolean) => void;
// }

interface formResult {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const SignUpModal: React.FC = () => {
  const { theme } = useTheme();
  const { toggleLoginModalOn } = useUserSystem();
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [passwordOnFocus, setPasswordOnFocus] = useState(false);
  const [lastTouch, setLastTouch] = useState(false);
  const [formResult, setFormResult] = useState<formResult>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // const captchaRef = useRef<ReCAPTCHA>(null);

  const createAccount = () => {
    const user = {
      username: userNameRef.current!.value,
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
      confirm_password: confirmPasswordRef.current!.value,
    };
    axios
      .post(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/signup", user)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Create New Account Success", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            theme: theme == "light" ? "light" : "dark",
          });
          setTimeout(() => {
            toggleLoginModalOn();
          }, 1500);
        }
      })
      .catch((err) => {
        toast.error(err.response.data, {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          theme: theme == "light" ? "light" : "dark",
        });
      });
  };

  const validateEmail = () => {
    const email = emailRef.current?.value;
    const emailRegEx = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
    return email && email !== "" && email.match(emailRegEx) ? true : false;
  };

  const validateUsername = () => {
    const username = userNameRef.current?.value;
    return username && username !== "" && username?.length <= 8 ? true : false;
  };

  const validatePassword = () => {
    const password = passwordRef.current?.value;
    const passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return password && password !== "" && password.match(passwordRegEx) ? true : false;
  };

  const validateConfirmPassword = () => {
    const confirmPassword = confirmPasswordRef.current?.value;
    const password = passwordRef.current?.value;
    return confirmPassword && password && confirmPassword === password ? true : false;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isValidEmail = validateEmail();
    const isValidUsername = validateUsername();
    const isValidPassword = validatePassword();
    const isValidConfirmPassword = validateConfirmPassword();

    if (isValidEmail && isValidUsername && isValidPassword && isValidConfirmPassword) {
      setFormResult({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      createAccount();
    } else {
      console.log();
      setFormResult({
        email: isValidEmail ? "" : "Please enter a valid email",
        username: isValidUsername ? "" : "Please enter a valid username",
        password: isValidPassword ? "" : "You password must have at least 8 charcacters, including 1 uppercase, 1 lowercase and 1 number",
        confirmPassword: isValidConfirmPassword ? "" : "You password must be same as above",
      });
    }
  };

  return (
    <div className="p-8 w-[350px]">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 items-center">
        <Input
          // isRequired
          type="email"
          variant={"underlined"}
          label="Email"
          ref={emailRef}
          description=" "
          // className="pb-4"
          errorMessage={formResult.email}
        />
        <Input
          // isRequired
          type="text"
          variant={"underlined"}
          label="Username"
          ref={userNameRef}
          description=" "
          errorMessage={formResult.username}
          // className="pb-4"
        />
        <Input
          // isRequired
          type="password"
          variant={"underlined"}
          label="Password"
          ref={passwordRef}
          onFocusChange={() => {
            setPasswordOnFocus(!passwordOnFocus);
            setFormResult({
              ...formResult,
              password: "",
            });
          }}
          description={
            passwordOnFocus ? "Your password must have at least 8 charcacters, including 1 uppercase, 1 lowercase and 1 number" : ""
          }
          errorMessage={formResult.password}
          // className="pb-0"
        />
        <Input
          // isRequired
          type="password"
          variant={"underlined"}
          label="Confirm Password"
          ref={confirmPasswordRef}
          onFocus={() => {
            setLastTouch(true);
          }}
          errorMessage={formResult.confirmPassword}
          // className="pb-4"
        />
        <div className="w-full pt-4 opacity-80 flex justify-between">
          Already have an account?
          <span className=" text-sky-600 underline hover:cursor-pointer hover:font-semibold" onClick={() => toggleLoginModalOn()}>
            Login here
          </span>
        </div>
        <Button className="w-full mt-4" variant="faded" type="submit" size="md" isDisabled={!lastTouch}>
          Sign Up
        </Button>
      </form>
    </div>
  );
};
export default SignUpModal;
