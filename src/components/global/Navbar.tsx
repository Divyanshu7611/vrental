// "use client";
// import Image from "next/image";
// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "@/context/UserContext";
// import { TbLogout } from "react-icons/tb";

// export default function Navbar() {
//   const [isToken, setToken] = useState<boolean>(false);
//   const [isSelectDrop, setDropDown] = useState<boolean>(false);

//   const userContext = useContext(UserContext);
//   const ProfileImage = userContext?.userAuthData?.image;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setToken(true);
//     }
//   }, []);

//   const toggleDropdown = () => {
//     setDropDown(!isSelectDrop);
//   };

//   return (
//     <div className="min-w-full lg:h-16 h-12 bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] fixed z-50 flex justify-center items-center">
//       <div className="mx-auto flex items-center justify-between h-full px-4 lg:px-8 w-full">
//         <div className="text-2xl font-bold text-[#00E0FF]">
//           <Image
//             src="/assets/Logo.png"
//             alt="Logo"
//             width={45}
//             height={45}
//             className="rounded-full"
//             quality={100}
//           />
//         </div>
//         <div className="mx-auto">
//           <ul className="flex items-center gap-6 mx-auto justify-center">
//             <li className="text-base font-semibold text-[#000000]">Rooms</li>
//             <li className="text-base font-semibold text-[#000000]">Flats</li>
//             <li className="text-base font-semibold text-[#000000]">Hostels</li>
//             <li className="text-base font-semibold text-[#000000]">Living</li>
//             <li className="text-base font-semibold text-[#000000]">P-G</li>
//           </ul>
//         </div>
//         <div className="relative">
//           {isToken ? (
//             <div className="relative flex items-center">
//               <img
//                 src={ProfileImage}
//                 alt="Profile"
//                 width={45}
//                 height={45}
//                 className="rounded-full cursor-pointer"
//                 onClick={toggleDropdown}
//               />
//               {isSelectDrop && (
//                 <div className="absolute top-14 right-0 bg-white shadow-md rounded-md w-48 py-2 z-10">
//                   <ul>
//                     <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
//                       <TbLogout /> Logout
//                     </li>
//                     <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
//                       <TbLogout /> Settings
//                     </li>
//                     <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
//                       <TbLogout /> Profile
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center gap-3">
//               <button className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium">
//                 SignUp
//               </button>
//               <button className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium">
//                 Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { TbLogout, TbMenu } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

export default function Navbar() {
  const [isToken, setToken] = useState<boolean>(false);
  const [isSelectDrop, setDropDown] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      <div className="min-w-full lg:h-16 h-12 bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] fixed z-50 flex justify-between items-center px-4 lg:px-8">
        <div className="text-2xl font-bold text-[#00E0FF]">
          <Image
            src="/assets/Logo.png"
            alt="Logo"
            width={45}
            height={45}
            className="rounded-full"
            quality={100}
          />
        </div>
        <div className="lg:hidden">
          <button className="text-2xl text-black" onClick={toggleSidebar}>
            {isSidebarOpen ? <RxCross2 /> : <GiHamburgerMenu />}
          </button>
        </div>
        <div className="hidden lg:flex mx-auto">
          <ul className="flex items-center gap-6 mx-auto justify-center">
            <li className="text-base font-semibold text-[#000000]">Rooms</li>
            <li className="text-base font-semibold text-[#000000]">Flats</li>
            <li className="text-base font-semibold text-[#000000]">Hostels</li>
            <li className="text-base font-semibold text-[#000000]">Living</li>
            <li className="text-base font-semibold text-[#000000]">P-G</li>
          </ul>
        </div>
        <div className="relative hidden lg:flex items-center">
          {isToken ? (
            <div className="relative flex items-center">
              <img
                src={ProfileImage}
                alt="Profile"
                width={45}
                height={45}
                className="rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {isSelectDrop && (
                <div className="absolute top-14 right-0 bg-white shadow-md rounded-md w-48 py-2 z-10">
                  <ul>
                    <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <TbLogout /> Logout
                    </li>
                    <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <TbLogout /> Settings
                    </li>
                    <li className="text-black flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <TbLogout /> Profile
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center gap-3">
              <button className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium">
                SignUp
              </button>
              <button className="bg-[#156f6f] text-white px-4 py-2 rounded-md font-medium">
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
          &times
        </button>
        <ul className="flex flex-col gap-6 mt-10 px-4">
          <li className="text-base font-semibold text-[#000000]">Rooms</li>
          <li className="text-base font-semibold text-[#000000]">Flats</li>
          <li className="text-base font-semibold text-[#000000]">Hostels</li>
          <li className="text-base font-semibold text-[#000000]">Living</li>
          <li className="text-base font-semibold text-[#000000]">P-G</li>
        </ul>
      </div>
    </div>
  );
}
