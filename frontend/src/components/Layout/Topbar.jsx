import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="main-color">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-white hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            <RiTwitterXFill className="h-5 w-5" />
          </a>
        </div>
        <div className="text-center text-sm flex-grow text-white">
          <span>We Ship worldwide - Fast and reliable shipping</span>
        </div>
        <div className="text-sm hidden md:block">
          <a href="tel:+1234567890" className="text-white hover:text-gray-300">
            +1 (234) 567-8900
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
