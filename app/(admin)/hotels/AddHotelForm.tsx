"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  name: string;
}

export default function AddHotelForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    stars: 3,
    locationId: null as number | null,
  });

  const [locations, setLocations] = useState<Location[]>([]);

  // Fetch danh sách Location để chọn
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/locations");
        const data = await res.json();
        if (res.ok) {
          setLocations(data.data || []);
        } else {
          console.error(data.error || "Failed to fetch locations");
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "stars") {
      setFormData((prev) => ({ ...prev, stars: Number(value) }));
    } else if (name === "locationId") {
      setFormData((prev) => ({ ...prev, locationId: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước khi thêm Hotel!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          stars: formData.stars,
          locationIds: formData.locationId ? [formData.locationId] : [], // gửi array
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Hotel created successfully!");
        console.log("New Hotel:", data);
        setFormData({
          name: "",
          address: "",
          stars: 3,
          locationId: null,
        });
        router.push("/hotels"); 
      } else {
        alert(data.error || "Failed to create hotel");
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
          Create New Hotel
        </h2>

        {/* Hotel Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Hotel Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter hotel name"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Address
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          />
        </div>

        {/* Stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Stars
          </label>
          <select
            name="stars"
            value={formData.stars}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>
                {s} ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Locations (multi-select) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Location
          </label>
          <select
            name="locationId"
            value={formData.locationId ?? ""}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
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
          Create Hotel
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
