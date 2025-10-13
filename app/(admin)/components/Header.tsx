"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  isSidebarOpen: boolean;
}

export default function Header({ isSidebarOpen }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // nếu bạn có lưu role

    // Chuyển về trang login
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 h-16 bg-gray-800/80 backdrop-blur-md shadow-lg flex items-center justify-between px-6 transition-all duration-300 ${
        isSidebarOpen ? "left-64" : "left-16"
      } right-0 z-10`}
    >
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Tổng Quan
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 font-medium">Admin User</span>
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
