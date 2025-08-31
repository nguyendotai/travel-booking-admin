"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="en">
      <body
      className= "antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 text-white"
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Header isSidebarOpen={isSidebarOpen} />
        <main
          className={`p-6 mt-16 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
