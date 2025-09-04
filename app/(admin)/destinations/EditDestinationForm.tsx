"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Location {
  id: number;
  name: string;
}

export default function EditDestinationForm({ id }: { id: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_id: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // hiển thị ảnh cũ/mới
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách location
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  // Fetch destination hiện tại
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/destinations/${id}`);
        const data = await res.json();

        setFormData({
          name: data.name,
          description: data.description,
          location_id: String(data.location_id),
        });

        if (data.image) {
          setPreview(`http://localhost:5000${data.image}`);
        }
      } catch (err) {
        console.error("Failed to fetch destination:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDestination();
  }, [id]);

  // Xử lý input
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

  // Xử lý file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // xem trước ảnh mới
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi chỉnh sửa!");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("location_id", formData.location_id);
    if (image) {
      form.append("image", image);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/destinations/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Destination updated successfully!");
        router.push("/destinations"); // quay lại danh sách
      } else {
        alert(data.error || "Failed to update destination");
      }
    } catch (err) {
      console.error("Update failed:", err);
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
          Edit Destination
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Location
          </label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
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
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
          />
        </div>

        {/* Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Image
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mb-3"
            />
          )}
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
          Update Destination
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
