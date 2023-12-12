import { createContext, useEffect, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import Loading from "@components/Loading";
import axios from "axios";

interface Props {
  children?: ReactNode;
}

interface UserSystemContextValue {
  loading: boolean;
  loggedIn: boolean;
  isadmin: boolean;
  user: userProps;
  showSignUpModal: boolean;
  showLoginModal: boolean;
  showForgotPasswordModal: boolean;
  toggleLoadingOn: () => void;
  toggleLoadingOff: () => void;
  toggleLoggedInOn: () => void;
  toggleIsAdminOn: () => void;
  logout: () => void;
  toggleSignUpModalOn: () => void;
  toggleLoginModalOn: () => void;
  toggleForgotPasswordModalOn: () => void;
  toggleAllOff: () => void;
  getLoginUser: () => userProps;
  setLoginUser: (user: string) => void;
}

interface userProps {
  name: string;
}

const UserSystemContext = createContext<UserSystemContextValue>({} as UserSystemContextValue);

export const useUserSystem = () => useContext(UserSystemContext);

export const UserSystemProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isadmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<userProps>({ name: "" });
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Get cookies and set loggedIn to true if cookie exists
  // Get cookies and set loggedIn to true if cookie exists
  // console.log(Cookies.get(user.name));

  useEffect(() => {
    console.log(Cookies.get("userId"));
    if (Cookies.get("loggedIn")) {
      console.log("Running");
      setLoggedIn(true);
    }
    if (Cookies.get("userId")) {
      axios.get(process.env.NEXT_PUBLIC_DEV_API_PATH + "account/" + Cookies.get("userId")).then((res) => {
        setUser({
          name: res.data.username ?? "",
        });
      });
    }
    if (Cookies.get("isAdmin")) {
      setIsAdmin(true);
    }
  }, []);

  const toggleLoadingOn = () => {
    setLoading(true);
  };

  const toggleLoadingOff = () => {
    setLoading(false);
  };

  const toggleLoggedInOn = () => {
    setLoggedIn(true);
  };

  const toggleIsAdminOn = () => {
    setIsAdmin(true);
  };

  const setLoginUser = (username: string) => {
    setUser({
      name: username,
    });
  };

  const getLoginUser = () => {
    return user;
  };

  const logout = () => {
    console.log("logout");
    Cookies.remove("loggedIn");
    Cookies.remove("userId");
    Cookies.remove("isAdmin");
    setUser({ name: "" });
    setIsAdmin(false);
    setLoggedIn(false);
  };

  const toggleSignUpModalOn = () => {
    setShowSignUpModal(true);
    setShowForgotPasswordModal(false);
    setShowLoginModal(false);
  };

  const toggleLoginModalOn = () => {
    setShowSignUpModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const toggleForgotPasswordModalOn = () => {
    setShowSignUpModal(false);
    setShowForgotPasswordModal(true);
    setShowLoginModal(false);
  };

  const toggleAllOff = () => {
    setShowSignUpModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(false);
  };

  const contextValue = {
    loading,
    loggedIn,
    isadmin,
    user,
    showSignUpModal,
    showLoginModal,
    showForgotPasswordModal,
    toggleLoadingOn,
    toggleLoadingOff,
    toggleLoggedInOn,
    toggleIsAdminOn,
    logout,
    toggleSignUpModalOn,
    toggleLoginModalOn,
    toggleForgotPasswordModalOn,
    toggleAllOff,
    getLoginUser,
    setLoginUser,
  };

  return <UserSystemContext.Provider value={contextValue}>{children}</UserSystemContext.Provider>;
};
