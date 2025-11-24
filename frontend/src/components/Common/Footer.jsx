import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div className="md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to know about new arrivals, sales, and special offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order
          </p>
          {/* Newsletter form */}
          <div className="max-w-md">
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 p-3 text-sm border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-r-md hover:bg-gray-800 transition-all whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        {/* Shop Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>
        {/* Support Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>
        {/* Follow Us Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              <RiTwitterXFill className="h-5 w-5" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            <span className="text-gray-600">+91 1234567890</span>
          </p>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-10 px-4 lg:px-0 border-t pt-6 border-gray-300">
        <p className="text-center mt-2 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} E-commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
