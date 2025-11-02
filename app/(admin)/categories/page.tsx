"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  type: string;
  status?: boolean;
  image?: string;
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("bạn có chắc muốn xóa Danh mục này không?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xóa danh mục!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ token }`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Xóa thành công");
        setCategories((prev) => prev.filter((cate) => cate.id !== id));
      } else {
        alert(data.error || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Lỗ khi xóa danh mục:", error);
      alert("Lỗi server khi xóa!");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">
          Manage Categories
        </h2>
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
            <th className="p-3 font-medium">Image</th>
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
              <td className="p-3 align-middle">{cat.id}</td>
              <td className="p-3 align-middle">
                {cat.image ? (
                  <img
                    src={`${cat.image}`}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500 italic">No image</span>
                )}
              </td>
              <td className="p-3 align-middle">{cat.name}</td>
              <td className="p-3 align-middle">{cat.type}</td>
              <td className="p-3 align-middle">
                <span
                  className={cat.status ? "text-green-400" : "text-red-400"}
                >
                  {cat.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex justify-center items-center space-x-2 h-full">
                  <Link href={`/categories/edit/${cat.id}`}>
                    <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                      Edit
                    </button>
                  </Link>
                  <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
