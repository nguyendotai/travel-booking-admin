"use client";

import { useState } from "react";
import {
  FaHome,
  FaTicketAlt,
  FaUsers,
  FaPlane,
  FaCog,
  FaBars,
} from "react-icons/fa";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const sidebarVariants = {
    open: { width: "16rem", transition: { duration: 0.3, ease: easeInOut } },
    closed: { width: "4rem", transition: { duration: 0.3, ease: easeInOut } },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-purple-900 shadow-lg"
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
    >
      <div className="p-4 flex items-center justify-between">
        <AnimatePresence>
          {isOpen && (
            <motion.span
              className="text-2xl font-extrabold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              TravelVerse
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none hover:text-blue-300"
        >
          <FaBars size={20} />
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {[
            { icon: <FaHome />, label: "Dashboard", href: "/" },
            { icon: <FaTicketAlt />, label: "Bookings", href: "/bookings" },
            { icon: <FaUsers />, label: "Users", href: "/users" },
            { icon: <FaPlane />, label: "Tours", href: "/tours" },
            { icon: <FaCog />, label: "Settings", href: "/settings" },
          ].map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all duration-300 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="ml-3 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
