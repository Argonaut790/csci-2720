import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useUserSystem } from "@/contexts/UserSystemContext";

// interface SignUpModalProps {
//   setShowModal: (show: boolean) => void;
// }

const SignUpModal: React.FC = () => {
  const { toggleLoginModalOn } = useUserSystem();
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLSpanElement>(null);

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
          resultRef.current!.innerText = "Registered successfully! ";
          setTimeout(() => {
            toggleLoginModalOn();
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response) {
          resultRef.current!.innerText = err.response.data;
        } else {
          resultRef.current!.innerText = "There is something went wrong.";
        }
      });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let isEmailInvalid = false;
    let isUsernameInvalid = false;
    let isPasswordInvalid = false;
    let isConfirmPasswordInvalid = false;
    let isUsernameLengthInvalid = false;

    const email = emailRef.current!.value;
    const username = userNameRef.current!.value;
    const password = passwordRef.current!.value;
    const confirmPassword = confirmPasswordRef.current!.value;

    resultRef.current!.innerText = "";
    // Client-side validation
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (email === "") {
      isEmailInvalid = true;
    } else {
      isEmailInvalid = false;
    }
    if (username === "") {
      isUsernameInvalid = true;
    } else if (username.length > 8) {
      resultRef.current!.innerText +=
        "- Username must be less than 9 characters\n";
      isUsernameLengthInvalid = true;
    } else {
      isUsernameInvalid = false;
    }
    if (password === "") {
      isPasswordInvalid = true;
    }
    if (confirmPassword === "") {
      isConfirmPasswordInvalid = true;
    }
    if (password !== confirmPassword) {
      resultRef.current!.innerText +=
        "- Your confirm password does not match\n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }
    if (!password.match(passwordRegEx)) {
      resultRef.current!.innerText +=
        "- Password must contains at least 1 upper case, 1 lower case, 1 number with the minimum length of 8 \n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }

    if (
      isPasswordInvalid ||
      isConfirmPasswordInvalid ||
      isEmailInvalid ||
      isUsernameInvalid
    ) {
      resultRef.current!.innerText +=
        "- Please enter your " +
        (isEmailInvalid ? "email" : "") +
        (isUsernameInvalid ? " username" : "") +
        (isPasswordInvalid ? " password" : "") +
        (isConfirmPasswordInvalid ? " and confirm your password " : "");
      resultRef.current!.innerText += "\n";
    }

    if (
      email !== "" &&
      username !== "" &&
      isUsernameLengthInvalid === false &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      password.match(passwordRegEx)
    ) {
      createAccount();
    }

    // Add "is-invalid" class to input fields that match the syntax
    // document.getElementById("floatingEmail")!.className = isEmailInvalid
    //   ? "form-control floating is-invalid"
    //   : "form-control floating";
    // document.getElementById("floatingUsername")!.className =
    //   isUsernameInvalid || isUsernameLengthInvalid
    //     ? "form-control floating is-invalid"
    //     : "form-control floating";
    // document.getElementById("floatingPassword")!.className = isPasswordInvalid
    //   ? "form-control floating is-invalid"
    //   : "form-control floating";
    // document.getElementById("floatingConfirmPassword")!.className =
    //   isConfirmPasswordInvalid
    //     ? "form-control floating is-invalid"
    //     : "form-control floating";
  };

  return (
    <div className="p-8 w-[350px]">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 items-center">
        <Input
          // isRequired
          type="email"
          variant={"underlined"}
          label="Email"
          ref={emailRef}
          // className="pb-4"
        />
        <Input
          // isRequired
          type="text"
          variant={"underlined"}
          label="Username"
          ref={userNameRef}
          // className="pb-4"
        />
        <Input
          // isRequired
          type="password"
          variant={"underlined"}
          label="Password"
          ref={passwordRef}
          // className="pb-4"
        />
        <Input
          // isRequired
          type="password"
          variant={"underlined"}
          label="Confirm Password"
          ref={confirmPasswordRef}
          // className="pb-4"
        />
        <div className="w-full opacity-80">
          Already have an account?{" "}
          <span
            className=" text-sky-600 underline hover:cursor-pointer hover:font-semibold"
            onClick={() => toggleLoginModalOn()}
          >
            Login here
          </span>
        </div>
        <Button variant="faded" type="submit" size="md" className="">
          Sign Up
        </Button>
      </form>
      <div className="d-grid gap-1 pt-2">
        <span id="result" ref={resultRef}></span>
      </div>
    </div>
  );
};
export default SignUpModal;
