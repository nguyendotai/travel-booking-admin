"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Xử lý xóa người dùng
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xóa người dùng!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Xóa người dùng thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.error || "Xóa thất bại!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Lỗi server khi xóa!");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Đang tải...</p>;
  }

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Quản lí người dùng</h2>
        <Link
          href="/users/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          <FaPlus className="mr-2" /> Thêm người dùng mới
        </Link>
      </div>

      {/* Bảng người dùng */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="p-3 font-medium">Thứ tự</th>
            <th className="p-3 font-medium">Tên</th>
            <th className="p-3 font-medium">Email</th>
            <th className="p-3 font-medium">Vai trò</th>
            <th className="p-3 font-medium">Trạng thái</th>
            <th className="p-3 font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <span
                  className={`${
                    user.role === "admin" ? "text-yellow-400" : "text-blue-300"
                  } font-medium`}
                >
                  {user.role}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={
                    user.status === "Active" ? "text-green-400" : "text-red-400"
                  }
                >
                  {user.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <Link href={`/users/edit/${user.id}`}>
                  <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                    Sửa
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
