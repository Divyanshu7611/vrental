"use client";
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { TbLogout, TbMenu } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";
import { MdOutlineShoppingCart } from "react-icons/md";
import Link from "next/link";

export default function Navbar() {
  const [isToken, setToken] = useState<boolean>(false);
  const [isSelectDrop, setDropDown] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const userContext = useContext(UserContext);
  const ProfileImage = userContext?.userAuthData?.image;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(true);
    }
  }, []);

  const toggleDropdown = () => {
    setDropDown(!isSelectDrop);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="min-w-full lg:h-16 h-12 backdrop-blur-xl bg-transparent fixed z-50 flex justify-between items-center px-3 lg:px-8 shadow-md">
        <div className="text-2xl font-bold text-[#00E0FF]">
          <img
            src="/assets/Logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          />
        </div>
        <div className="lg:hidden">
          <button className="text-2xl text-black" onClick={toggleSidebar}>
            {isSidebarOpen ? <RxCross2 /> : <GiHamburgerMenu />}
          </button>
        </div>
        <div className="hidden lg:flex mx-auto">
          <ul className="flex items-center gap-6 mx-auto justify-center">
            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/">Home</a>
            </li>

            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/category?category=ROOM">Rooms</a>
            </li>

            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/category?category=HOSTEL">Hostels</a>
            </li>
            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/category?category=PG">P-G</a>
            </li>
            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/category?category=FLAT">Flats</a>
            </li>
            <li className="text-base font-semibold text-[#000000] cursor-pointer hover:scale-110 hover:font-bold">
              <a href="/category?category=CO-LIVING">Co-Living</a>
            </li>
          </ul>
        </div>
        <div className="relative hidden lg:flex items-center">
          {isToken ? (
            <div className="relative flex items-center">
              <div className="flex items-center aspect-auto">
                {/* <img
                  src="/assets/cart.png"
                  alt=""
                  width={50}
                  height={50}
                  className="aspect-auto relative top-1 hover:scale-110 cursor-pointer"
                  onClick={() => {
                    router.push("/wishlist");
                  }}
                /> */}
                <Link href="/wishlist" prefetch>
                
                <MdOutlineShoppingCart className="w-7 h-7 mr-3"/>
                </Link>

                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName} ${userContext?.userAuthData?.lastName}&backgroundColor=418FA9`}
                  alt="Profile"
                  width={38}
                  height={38}
                  className="rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />
              </div>
              {isSelectDrop && (
                <div className="absolute top-14 right-0 bg-white shadow-md rounded-md w-48 py-2 z-10">
                  <ul>
                    <li
                      className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userAuthData");
                        toast.success("Logout Successfully");
                        window.location.reload();
                        router.push("/");
                      }}
                    >
                      <TbLogout /> Logout
                    </li>
                    <li
                      className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        router.push("/test");
                      }}
                    >
                      <MdOutlineAddHomeWork /> Registration
                    </li>
                    <li
                      className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        router.push("/profile");
                      }}
                    >
                      <CgProfile /> Profile
                    </li>
                    <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <a href="/wishlist" className="flex items-center gap-2">
                        <PiShoppingCart /> Wishlist
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center gap-3">
              {/* <button
                className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium"
                onClick={() => {
                  router.push("/auth");
                }}
              >
                SignUp
              </button> */}
              <button
                className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium"
                onClick={() => {
                  router.push("/auth");
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 w-64`}
      >
        <button className="text-2xl text-black p-4" onClick={toggleSidebar}>
          &times;
        </button>
        <ul className="flex flex-col gap-6 mt-10 px-4">
          <li className="text-base font-semibold text-[#000000]">
            <a href="/">Go to Home</a>
          </li>

          <li className="text-base font-semibold text-[#000000]">
            <a href="/category?category=ROOM">Rooms</a>
          </li>

          <li className="text-base font-semibold text-[#000000]">
            <a href="/category?category=HOSTEL">Hostels</a>
          </li>
          <li className="text-base font-semibold text-[#000000]">
            <a href="/category?category=PG">P-G</a>
          </li>
          <li className="text-base font-semibold text-[#000000]">
            <a href="/category?category=FLAT"> Flats</a>
          </li>
          <li className="text-base font-semibold text-[#000000]">
            <a href="/category?category=CO-LIVING">Co-Living</a>
          </li>
          {isToken ? (
            <>
              <li className="text-base font-semibold text-[#000000] cursor-pointer">
                <a href="/profile">Profile</a>
              </li>
              <li className="text-base font-semibold text-[#000000] cursor-pointer">
                <a href="/test">Register Apartment</a>
              </li>
              <li className="text-base font-semibold text-[#000000] cursor-pointer">
                <a href="/wishlist">Wishlist</a>
              </li>
              <li className="text-base font-semibold text-[#000000] cursor-pointer">
                <a
                  onClick={() => {
                    toast.success("Logout Successfully");
                    localStorage.removeItem("token");
                    localStorage.removeItem("userAuthData");
                    window.location.reload();

                    router.push("/");
                  }}
                >
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="text-base font-semibold text-[#000000] cursor-pointer">
                <a href="/auth">Login</a>
              </li>
              {/* <li
                className="text-base font-semibold text-[#000000] cursor-pointer"
                onClick={() => {
                  router.push("/auth");
                }}
              >
                <a href="">Signup</a>
              </li> */}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
