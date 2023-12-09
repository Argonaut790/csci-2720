import {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface Props {
  children?: ReactNode;
}

interface UserSystemContextValue {
  loggedIn: boolean;
  user: object;
  showSignUpModal: boolean;
  showLoginModal: boolean;
  showForgotPasswordModal: boolean;
  toggleLoggedInOn: () => void;
  logout: () => void;
  toggleSignUpModalOn: () => void;
  toggleLoginModalOn: () => void;
  toggleForgotPasswordModalOn: () => void;
  toggleAllOff: () => void;
}

const UserSystemContext = createContext<UserSystemContextValue>(
  {} as UserSystemContextValue
);

export const useUserSystem = () => useContext(UserSystemContext);

export const UserSystemProvider = ({ children }: Props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Get cookies and set loggedIn to true if cookie exists
  // Get cookies and set loggedIn to true if cookie exists
  useEffect(() => {
    if (Cookies.get("loggedIn")) {
      setLoggedIn(true);
    }
  }, []);

  const toggleLoggedInOn = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    console.log("logout");
    Cookies.remove("loggedIn");
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
    loggedIn,
    user,
    showSignUpModal,
    showLoginModal,
    showForgotPasswordModal,
    toggleLoggedInOn,
    logout,
    toggleSignUpModalOn,
    toggleLoginModalOn,
    toggleForgotPasswordModalOn,
    toggleAllOff,
  };

  return (
    <UserSystemContext.Provider value={contextValue}>
      {children}
    </UserSystemContext.Provider>
  );
};
