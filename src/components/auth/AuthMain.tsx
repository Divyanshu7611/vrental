// "use client";
// import React from "react";
// import { FcGoogle } from "react-icons/fc";
// import Signup from "./Signup";
// import Login from "./Login";
// import { useState } from "react";

// export default function AuthMain() {
//   const [isLogin, setIsLogin] = useState(false);
//   return (
//     <div className="flex flex-col gap-5 h-full px-2">
//       <button className="w-full bg-[#434FAA] py-1 px-2 text-start text-white text-md flex justify-start items-center gap-12 hover:scale-105 transition-all duration-200 rounded-md">
//         <FcGoogle className="text-xl" />
//         Connect with Google
//       </button>
//       <div className="flex w-full justify-between gap-2 items-center">
//         <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
//         <div className="opacity-50 text-lg font-light italic">or</div>
//         <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
//       </div>
//       {isLogin ? <Login /> : <Signup />}
//       {isLogin ? (
//         <a
//           onClick={() => {
//             setIsLogin(false);
//           }}
//           className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
//         >
//           Create New Account
//         </a>
//       ) : (
//         <a
//           onClick={() => {
//             setIsLogin(true);
//           }}
//           className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
//         >
//           Already have an account
//         </a>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Signup from "./Signup";
import Login from "./Login";
import ResetPassword from "./ResetLink"; // Import the ResetPassword component

export default function AuthMain() {
  const [view, setView] = useState<"login" | "signup" | "resetPassword">(
    "login"
  );

  return (
    <div className="flex flex-col gap-5 h-full px-2">
      <button
        className="w-full bg-[#434FAA] py-2 px-2 text-start text-white lg:text-md text-md flex justify-start items-center lg:gap-12 gap-6 hover:scale-105 transition-all duration-200 rounded-md"
        onClick={() => {
          alert("This Feature is Not Available Yet.");
        }}
      >
        <FcGoogle className="lg:text-xl text-lg" />
        Connect with Google
      </button>
      <div className="flex w-full justify-between gap-2 items-center">
        <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
        <div className="opacity-50 text-lg font-light italic">or</div>
        <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
      </div>

      {view === "login" && <Login />}
      {view === "signup" && <Signup />}
      {view === "resetPassword" && <ResetPassword />}

      {view === "login" ? (
        <>
          <a
            onClick={() => setView("signup")}
            className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
          >
            Create New Account
          </a>
          <a
            onClick={() => setView("resetPassword")}
            className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
          >
            Forgot Password?
          </a>
        </>
      ) : view === "signup" ? (
        <a
          onClick={() => setView("login")}
          className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
        >
          Already have an account
        </a>
      ) : (
        <a
          onClick={() => setView("login")}
          className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
        >
          Back to Login
        </a>
      )}
    </div>
  );
}
