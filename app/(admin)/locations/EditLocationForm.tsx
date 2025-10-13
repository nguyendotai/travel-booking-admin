"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface FixedCategory {
  id: number;
  name: string;
}

export default function EditLocationForm({ id }: { id: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    fixedCategoryId: "",
  });

  const [categories, setCategories] = useState<FixedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories fixed
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/categories?type=fixed"
        );
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

  // Fetch location hiện tại
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/locations/${id}`);
        const result = await res.json();

        if (res.ok && result.success && result.data) {
          setFormData({
            name: result.data.name || "",
            country: result.data.country || "",
            description: result.data.description || "",
            fixedCategoryId: result.data.fixedCategoryId?.toString() || "",
          });
        } else {
          console.error(result.error || "Không tìm thấy location");
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLocation();
  }, [id]);

  // Handle input
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

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi chỉnh sửa Location!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Location updated successfully!");
        router.push("/locations"); // redirect về danh sách location
      } else {
        alert(data.error || "Failed to update location");
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error!");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

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
          Edit Location
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
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
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
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 h-28"
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
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
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
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold hover:bg-gradient-to-l"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Location
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
