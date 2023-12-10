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
  isadmin: boolean;
  user: object;
  showSignUpModal: boolean;
  showLoginModal: boolean;
  showForgotPasswordModal: boolean;
  toggleLoggedInOn: () => void;
  toggleIsAdminOn: () => void;
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
  const [isadmin, setIsAdmin] = useState(false);
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

  const toggleIsAdminOn = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    console.log("logout");
    Cookies.remove("loggedIn");
    Cookies.remove("userId");
    Cookies.remove("isAdmin");
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
    loggedIn,
    isadmin,
    user,
    showSignUpModal,
    showLoginModal,
    showForgotPasswordModal,
    toggleLoggedInOn,
    toggleIsAdminOn,
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
