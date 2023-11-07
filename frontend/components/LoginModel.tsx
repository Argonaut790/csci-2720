import { useState, useRef } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  //useref for email and password
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLSpanElement>(null);

  //   const navigate = useNavigate();
  //   const result = document.getElementById("result")!;

  const login = () => {
    const user = {
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    };
    axios
      .post(process.env.REACT_APP_DEV_API_PATH + "/account/login", user)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          //   resultRef.innerText = "Logged in successfully!";
          // turn resultref's inner text to logged in successfully
          resultRef.current!.innerText = "Logged in successfully!";

          localStorage.setItem(
            "user",
            JSON.stringify({ userId: res.data.userId })
          );

          //   navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          resultRef.current!.innerText = err.response.data;
        } else {
          resultRef.current!.innerText = "Invalid email / password";
        }
      });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let isEmailInvalid = false;
    let isPasswordInvalid = false;

    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;

    console.log(email);
    console.log(password);

    e.preventDefault();
    resultRef.current!.innerText = "";
    if (email === "") {
      isEmailInvalid = true;
    } else {
      isEmailInvalid = false;
    }
    if (password === "") {
      isPasswordInvalid = true;
    }

    if (isPasswordInvalid || isEmailInvalid) {
      resultRef.current!.innerText +=
        "- Please enter your " +
        (isEmailInvalid ? "email" : "") +
        (isPasswordInvalid ? " password" : "");
    }

    if (email !== "" && password !== "") {
      login();
    }

    // Add "is-invalid" class to input fields that match the syntax
    // document.getElementById("floatingEmail").className = isEmailInvalid
    //   ? "form-control floating is-invalid"
    //   : "form-control floating";
    // document.getElementById("floatingPassword").className = isPasswordInvalid
    //   ? "form-control floating is-invalid"
    //   : "form-control floating";
  };

  //   const handleForgotPassword = () => {
  //     setShowForgotPasswordModal(true);
  //     setShowModal(false);
  //   };

  return (
    <div className="modalContainer">
      {/* <button
        type="button"
        className="btn-close"
        onClick={() => setShowModal(false)}
      ></button> */}

      <form onSubmit={onSubmit}>
        <div className="form-floating ">
          <input
            type="email"
            name="email"
            className="form-control floating"
            id="floatingEmail"
            placeholder="email"
            ref={emailRef}
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            name="password"
            className="form-control floating"
            id="floatingPassword"
            placeholder="password"
            ref={passwordRef}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Login"
            className="btn btn-outline-warning"
          />
        </div>
      </form>
      <div className="d-grid gap-1 pt-2">
        {/* <button className="btn btn-light" onClick={handleForgotPassword}>
          Forgot Password?
        </button> */}
        <span id="result" ref={resultRef}></span>
      </div>
    </div>
  );
};
// forgot password button ||
export default LoginModal;
