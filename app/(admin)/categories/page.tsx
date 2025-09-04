"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function CategoriesManagementPage() {
  const categories = [
    { id: "#C001", name: "Adventure", type: "Fixed", status: "Active" },
    { id: "#C002", name: "Luxury", type: "Optional", status: "Inactive" },
    { id: "#C003", name: "Family", type: "Fixed", status: "Active" },
  ];

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Manage Categories</h2>
        <Link
          href="/categories/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          <FaPlus className="mr-2" /> Add New Category
        </Link>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="p-3 font-medium">Category ID</th>
            <th className="p-3 font-medium">Category Name</th>
            <th className="p-3 font-medium">Type</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <motion.tr
              key={cat.id}
              className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="p-3">{cat.id}</td>
              <td className="p-3">{cat.name}</td>
              <td className="p-3">{cat.type}</td>
              <td className="p-3">
                <span className={cat.status === "Active" ? "text-green-400" : "text-red-400"}>
                  {cat.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">Edit</button>
                <button className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition">Delete</button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
