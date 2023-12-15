import { useState } from "react";
import jwt_decode from "jwt-decode";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignUpModal from "@/components/SignUpModal";
import LoginModal from "@/components/LoginModel";
// import { useNavigate } from "react-router-dom";
// import ForgotPasswordModal from "./ForgotPasswordModal";
import { Button } from "@nextui-org/react";
import { useUserSystem } from "@/contexts/UserSystemContext";

// External UI libraries to upgrade user experience
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSystem = () => {
	const { showSignUpModal, showLoginModal, showForgotPasswordModal } =
		useUserSystem();
	// const onGoogleSignInFailure = (response) => {
	//   console.log("Google sign in failed.");
	//   console.log(response);
	// };

	return (
		<div
			id="signUp"
			className="h-full flex items-center justify-center gap-4"
			key="signUp"
		>
			{/* <div>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            theme="outline"
            type="standard"
            size="large"
            text="signup_with"
            shape="circle"
            // width="250"
            locale="en"
            onSuccess={onGoogleSignInSuccess}
            onError={onGoogleSignInFailure}
          />
        </GoogleOAuthProvider>
      </div> */}

			{showSignUpModal ? <SignUpModal /> : null}
			{showLoginModal ? <LoginModal /> : null}
			{/* {showForgotPasswordModal ? (
        <ForgotPasswordModal setShowModal={setShowForgotPasswordModal} />
      ) : null} */}

			{/* <button type="button" className="btn btn-light" onClick={handleLogIn}>
        Already have an account?
      </button>

      <button type="button" className="btn btn-light" onClick={handleSignUp}>
        Sign Up with Email
      </button> */}
			<ToastContainer />
		</div>
	);
};

export default UserSystem;
