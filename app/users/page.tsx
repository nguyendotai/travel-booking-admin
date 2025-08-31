"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

export default function UsersManagementPage() {
  const users = [
    {
      id: "#U001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Customer",
      joined: "2025-01-15",
      status: "Active",
    },
    {
      id: "#U002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Admin",
      joined: "2025-02-20",
      status: "Active",
    },
    {
      id: "#U003",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Customer",
      joined: "2025-03-10",
      status: "Inactive",
    },
  ];

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Manage Users</h2>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform">
          <FaPlus className="mr-2" />
          Add New User
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="p-3 font-medium">User ID</th>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Email</th>
            <th className="p-3 font-medium">Role</th>
            <th className="p-3 font-medium">Joined Date</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
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
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.joined}</td>
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
                <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}