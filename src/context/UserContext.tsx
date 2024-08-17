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
  wishlist: Record<string, FlatCardProps>; // Change to object for storing card data
}

interface FlatCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  image: string;
  flexProp: string;
  category: string;
  averageRating: number;
  contactNo: number;
  furnitureDescription: string;
  parking: boolean;
  electricity: boolean;
  facility: string;
  availableFor: string;
  furniture: boolean;
  client: string[];
}

interface UserContextType {
  userAuthData: UserAuthData | null;
  setAuthData: (value: UserAuthData) => void;
  AuthDataHandler: (value: UserAuthData) => void;
  handleForm: boolean;
  setHandleForm: (value: boolean) => void;
  wishlist: Record<string, FlatCardProps>; // Updated type
  addToWishlist: (apartment: FlatCardProps) => void;
  removeFromWishlist: (apartmentId: string) => void;
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
  const [wishlist, setWishlist] = useState<Record<string, FlatCardProps>>({});

  const AuthDataHandler = (value: UserAuthData) => {
    setAuthData(value);
    localStorage.setItem("userAuthData", JSON.stringify(value));
    setWishlist(value.wishlist || {});
  };

  const addToWishlist = (apartment: FlatCardProps) => {
    if (!wishlist[apartment.id]) {
      const updatedWishlist = {
        ...wishlist,
        [apartment.id]: apartment,
      };
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      // Optionally, update userAuthData to include the updated wishlist
      if (userAuthData) {
        const updatedUserAuthData = {
          ...userAuthData,
          wishlist: updatedWishlist,
        };
        setAuthData(updatedUserAuthData);
        localStorage.setItem(
          "userAuthData",
          JSON.stringify(updatedUserAuthData)
        );
      }
    }
  };

  const removeFromWishlist = (apartmentId: string) => {
    const { [apartmentId]: _, ...updatedWishlist } = wishlist;
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Optionally, update userAuthData to include the updated wishlist
    if (userAuthData) {
      const updatedUserAuthData = {
        ...userAuthData,
        wishlist: updatedWishlist,
      };
      setAuthData(updatedUserAuthData);
      localStorage.setItem("userAuthData", JSON.stringify(updatedUserAuthData));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userAuthData");
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedUser) {
      AuthDataHandler(JSON.parse(storedUser));
    }

    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
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
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
