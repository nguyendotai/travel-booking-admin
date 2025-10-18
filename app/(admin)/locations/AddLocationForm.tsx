"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface FixedCategory {
  id: number;
  name: string;
}

export default function AddLocationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    fixedCategoryId: "", // 👈 thêm field này
  });

  const [categories, setCategories] = useState<FixedCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories?type=fixed");
        const data = await res.json();
        if (res.ok) {
          setCategories(data.data || []);
        } else {
          console.error(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi thêm Location!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Location created successfully!");
        console.log("New Location:", data);
        setFormData({
          name: "",
          country: "",
          description: "",
          fixedCategoryId: "",
        });
        router.push("/hotels"); 
      } else {
        alert(data.error || "Failed to create location");
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
          Create New Location
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Location Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter location name"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Country */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Country
          </label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter location description"
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
          />
        </div>

        {/* Fixed Category Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Fixed Category
          </label>
          <select
            name="fixedCategoryId"
            value={formData.fixedCategoryId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Location
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
