// import React from "react";
// import { footerLinks } from "@/Data/footer";

// type Link = {
//   name: string;
//   href: string;
// };

// type Section = {
//   section: string;
//   links: Link[];
// };

// function Footer() {
//   return (
//     <div className="min-w-screen bg-gradient-to-b from-[#000000] to-[#014247] p-10 px-5">
//       <div className="max-w-[1200px] mx-auto flex flex-wrap gap-10 py-5 justify-between">
//         {footerLinks.map((item: Section, index) => (
//           <div key={index} className="flex flex-col gap-3">
//             <h1 className="text-white font-normal text-lg">{item.section}</h1>
//             <ul className="flex flex-col gap-2">
//               {item.links.map((link, index) => (
//                 <li key={index} className="text-gray-400 text-sm">
//                   <a href={link.href}>{link.name}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//       <div className="max-w-[1200px] mx-auto">
//         <hr className="opacity-40" />
//         <div className="w-full flex lg:justify-between justify-center gap-5 flex-wrap mt-5">
//           <ul className="flex gap-2 items-center text-sm list-none font-normal text-gray-400">
//             <li>
//               <a href="/about">About Us</a>
//             </li>{" "}
//             |
//             <li>
//               <a href="/policy">Terms & Conditions</a>
//             </li>
//             |
//             <li>
//               <a href="category?category=ROOM">Services</a>
//             </li>
//           </ul>
//           <p className="text-sm list-none font-normal text-gray-400">
//             <a href="https://thedivyanshu.me">
//               Developed By Divyanshu Sharma
//             </a>
//           </p>
//           <p className="text-sm list-none font-normal text-gray-400">
//             All Copyrights Reserved to VRENTAL
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Footer;

"use client";

import React from "react";
import { footerLinks } from "@/Data/footer";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

type Link = {
  name: string;
  href: string;
};

type Section = {
  section: string;
  links: Link[];
};

function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white">

      {/* Top Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">

        {/* Brand */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            VRENTAL
          </h1>
          <p className="text-blue-100 mt-3 max-w-md">
            Find your perfect rental home with ease. Rooms, Flats, PGs, Hostels and more — all in one place.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-12 justify-between">
          {footerLinks.map((item: Section, index) => (
            <div key={index} className="flex flex-col gap-4 min-w-[150px]">
              <h2 className="text-white font-semibold text-lg">
                {item.section}
              </h2>

              <ul className="flex flex-col gap-2">
                {item.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-blue-100 text-sm hover:text-white transition duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-400/40"></div>

      {/* Bottom Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* Legal Links */}
        <ul className="flex gap-4 items-center text-sm text-blue-100 flex-wrap justify-center">
          <li>
            <a href="/about" className="hover:text-white transition">
              About Us
            </a>
          </li>
          <li>|</li>
          <li>
            <a href="/policy" className="hover:text-white transition">
              Terms & Conditions
            </a>
          </li>
          <li>|</li>
          <li>
            <a href="/category?category=ROOM" className="hover:text-white transition">
              Services
            </a>
          </li>
        </ul>

        {/* Social Media */}
        <div className="flex gap-4">
          <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
            <Facebook size={18} />
          </a>
          <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
            <Instagram size={18} />
          </a>
          <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
            <Twitter size={18} />
          </a>
          <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
            <Linkedin size={18} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-blue-100 text-center">
          © {new Date().getFullYear()} VRENTAL. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
