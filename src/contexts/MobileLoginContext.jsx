import { createContext, useContext, useState } from "react";
import MobileLoginModal from "../components/Helpers/MobileLoginModal";

const MobileLoginContext = createContext();

export function MobileLoginProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const showMobileLogin = (onSuccess) => {
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  };

  const closeMobileLogin = () => {
    setIsOpen(false);
    setOnSuccessCallback(null);
  };

  const handleSuccess = () => {
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  return (
    <MobileLoginContext.Provider value={{ showMobileLogin }}>
      {children}
      <MobileLoginModal
        isOpen={isOpen}
        onClose={closeMobileLogin}
        onSuccess={handleSuccess}
      />
    </MobileLoginContext.Provider>
  );
}

export function useMobileLogin() {
  const context = useContext(MobileLoginContext);
  if (!context) {
    throw new Error("useMobileLogin must be used within MobileLoginProvider");
  }
  return context;
}

