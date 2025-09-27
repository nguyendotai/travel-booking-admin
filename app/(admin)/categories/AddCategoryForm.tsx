"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AddCategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "fixed",
    startDate: "",
    endDate: "",
    status: true,
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi thêm Category!");
      return;
    }

    // Nếu chọn optional thì phải có startDate và endDate
    if (
      formData.type === "optional" &&
      (!formData.startDate || !formData.endDate)
    ) {
      alert("Vui lòng chọn Start Date và End Date cho category optional!");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("type", formData.type);
    if (formData.type === "optional") {
      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
    }
    if (image) {
      form.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Category created successfully!");
        console.log("New Category:", data);
        setFormData({
          name: "",
          description: "",
          type: "fixed",
          startDate: "",
          endDate: "",
          status: true,
        });
        setImage(null);
      } else {
        alert(data.error || "Failed to create Category");
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error!");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Create New Category
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Category Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter category description"
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
          />
        </div>

        {/* Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Category Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="fixed">Fixed</option>
            <option value="optional">Optional</option>
          </select>
        </div>

        {/* StartDate & EndDate chỉ hiển thị nếu type = optional */}
        {formData.type === "optional" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required={formData.type === "optional"}
                className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required={formData.type === "optional"}
                className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        )}

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value === "true",
              }))
            }
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Image upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-white"
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Category
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
