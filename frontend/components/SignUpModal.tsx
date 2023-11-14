import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// interface SignUpModalProps {
//   setShowModal: (show: boolean) => void;
// }

const SignUpModal: React.FC = () => {
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // const captchaRef = useRef<ReCAPTCHA>(null);

  const createAccount = () => {
    const user = {
      username: username,
      email: email,
      password: password,
      isGoogleSign: false,
    };

    axios
      .post(process.env.REACT_APP_DEV_API_PATH + "/account", user)
      .then((res) => {
        if (res.status === 200) {
          document.getElementById("result")!.innerText =
            "User was registered successfully! Please check your email";
        }
      })
      .catch((err) => {
        document.getElementById("result")!.innerText = err.response.data;
      });

    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let isEmailInvalid = false;
    let isUsernameInvalid = false;
    let isPasswordInvalid = false;
    let isPasswordEmpty = false;
    let isConfirmPasswordEmpty = false;
    let isConfirmPasswordInvalid = false;
    let isUsernameLengthInvalid = false;

    document.getElementById("result")!.innerText = "";
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
      document.getElementById("result")!.innerText +=
        "- Username must be less than 9 characters\n";
      isUsernameLengthInvalid = true;
    } else {
      isUsernameInvalid = false;
    }
    if (password === "") {
      isPasswordEmpty = true;
    }
    if (confirmPassword === "") {
      isConfirmPasswordEmpty = true;
    }
    if (password !== confirmPassword) {
      document.getElementById("result")!.innerText +=
        "- Your confirm password does not match\n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }
    if (!password.match(passwordRegEx)) {
      document.getElementById("result")!.innerText +=
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
      document.getElementById("result")!.innerText +=
        "- Please enter your " +
        (isEmailInvalid ? "email" : "") +
        (isUsernameInvalid ? " username" : "") +
        (isPasswordEmpty ? " password" : "") +
        (isConfirmPasswordEmpty ? " and confirm your password " : "");
      document.getElementById("result")!.innerText += "\n";
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
    document.getElementById("floatingEmail")!.className = isEmailInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingUsername")!.className =
      isUsernameInvalid || isUsernameLengthInvalid
        ? "form-control floating is-invalid"
        : "form-control floating";
    document.getElementById("floatingPassword")!.className = isPasswordInvalid
      ? "form-control floating is-invalid"
      : "form-control floating";
    document.getElementById("floatingConfirmPassword")!.className =
      isConfirmPasswordInvalid
        ? "form-control floating is-invalid"
        : "form-control floating";
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="name@example.com"
          value={email}
          onChange={onChangeEmail}
        />
        <label htmlFor="floatingEmail">Email address</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingUsername"
          placeholder="Username"
          value={username}
          onChange={onChangeUsername}
        />
        <label htmlFor="floatingUsername">Username</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingConfirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
      </div>
      <div className="d-grid gap-2 mt-3">
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </div>
      <p id="result" className="mt-3"></p>
    </form>
  );
};
export default SignUpModal;
