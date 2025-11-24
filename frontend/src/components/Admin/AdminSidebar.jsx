import React, { useState } from "react";
import {
  FaBoxOpen,
  FaSignOutAlt,
  FaStore,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const navItems = [
    { to: "/admin/users", icon: FaUser, label: "Users" },
    { to: "/admin/products", icon: FaBoxOpen, label: "Products" },
    { to: "/admin/orders", icon: FaClipboardList, label: "Orders" },
    { to: "/", icon: FaStore, label: "Shop" },
  ];

  return (
    <div
      className={`relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >

      <div className="p-6 flex-1 flex flex-col">
        {/* Logo/Brand */}
        <div className="mb-8">
          <Link to="/admin" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-lg shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              <FaStore className="text-white text-xl" />
            </div>
            {!isCollapsed && (
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                E-shop
              </span>
            )}
          </Link>
        </div>

        {/* Dashboard Title */}
        {!isCollapsed && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-300 uppercase tracking-wider text-center border-b border-gray-700 pb-3">
              Admin Dashboard
            </h2>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } py-3.5 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <item.icon
                    className={`text-xl ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    } transition-colors duration-200`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl flex items-center ${
              isCollapsed ? "justify-center" : "justify-center space-x-2"
            } shadow-lg hover:shadow-red-500/30 transition-all duration-200 group`}
          >
            <FaSignOutAlt className="text-lg group-hover:rotate-12 transition-transform duration-200" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default AdminSidebar;
