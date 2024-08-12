"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface UserAuthData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  adharNo: number;
  image: string;
  phone: number;
  clientID: string;
  participated: any[];
  role: string;
  __v: number;
  age: number;
  profession: string;
  bio: string;
}

interface UserContextType {
  userAuthData: UserAuthData | null;
  setAuthData: (value: UserAuthData) => void;
  AuthDataHandler: (value: UserAuthData) => void;
  handleForm: boolean;
  setHandleForm: (value: boolean) => void;
}

type Props = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserContextProvider({ children }: Props) {
  const [userAuthData, setAuthData] = useState<UserAuthData | null>(null);
  const [handleForm, setHandleForm] = useState<boolean>(false);

  const AuthDataHandler = (value: UserAuthData) => {
    setAuthData(value);
    localStorage.setItem("userAuthData", JSON.stringify(value));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userAuthData");
    if (storedUser) {
      AuthDataHandler(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userAuthData,
        setAuthData: AuthDataHandler,
        AuthDataHandler,
        handleForm,
        setHandleForm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
