import React from "react";
import { footerLinks } from "@/Data/footer";

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
    <div className="min-w-screen bg-[#2D363C] p-10">
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-10 py-5 justify-between">
        {footerLinks.map((item: Section, index) => (
          <div key={index} className="flex flex-col gap-3">
            <h1 className="text-white font-normal text-lg">{item.section}</h1>
            <ul className="flex flex-col gap-2">
              {item.links.map((link, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto">
        <hr className="opacity-40" />
        <div className="w-full flex lg:justify-between justify-center gap-5 flex-wrap mt-5">
          <ul className="flex gap-2 items-center text-sm list-none font-normal text-gray-400">
            <li>Privacy & Policy</li> |<li>Terms & Conditions</li>|
            <li>Services</li>
          </ul>
          <p className="text-sm list-none font-normal text-gray-400">
            All Copyrights Reserved to VRENTAL
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
