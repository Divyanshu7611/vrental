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
    <div className="min-w-screen bg-gradient-to-b from-[#000000] to-[#014247] p-10 px-5">
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
            <li>
              <a href="/about">About Us</a>
            </li>{" "}
            |
            <li>
              <a href="/policy">Terms & Conditions</a>
            </li>
            |
            <li>
              <a href="category?category=ROOM">Services</a>
            </li>
          </ul>
          <p className="text-sm list-none font-normal text-gray-400">
            <a href="https://thedivyanshu.me">
              Developed By Divyanshu Sharma
            </a>
          </p>
          <p className="text-sm list-none font-normal text-gray-400">
            All Copyrights Reserved to VRENTAL
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
