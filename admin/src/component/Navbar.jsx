import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between bg-white px-4 shadow-md sm:px-6">
      <img
        src={assets.logo3}
        alt="website logo"
        className="h-11 w-auto object-contain"
      />
      <button
        onClick={() => setToken("")}
        className="rounded border border-gray-400 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
