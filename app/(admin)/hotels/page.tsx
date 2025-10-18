"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Location {
  id: number;
  name: string;
}

interface Hotel {
  id: number;
  name: string;
  locations: Location[];
  status: string | null;
  rating: string | null;
}

export default function HotelsManagementPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hotels");
        if (!res.ok) {
          throw new Error("Lỗi khi fetch hotels");
        }
        const data = await res.json();
        setHotels(data.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách sạn này không?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Xóa thành công");
        setHotels((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert(data.error || "Xóa thất bại");
      }
    } catch (err) {
      console.log("Xóa Thất bại:", err);
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Manage Hotels</h2>
        <Link
          href="/hotels/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          <FaPlus className="mr-2" /> Add New Hotel
        </Link>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="p-3 font-medium">Hotel ID</th>
            <th className="p-3 font-medium">Hotel Name</th>
            <th className="p-3 font-medium">Location</th>
            <th className="p-3 font-medium">Rating</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel, index) => (
            <motion.tr
              key={hotel.id}
              className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="p-3">{hotel.id}</td>
              <td className="p-3">{hotel.name}</td>
              <td className="p-3">
                {hotel.locations && hotel.locations.length > 0
                  ? hotel.locations.map((loc) => loc.name).join(", ")
                  : "N/A"}
              </td>
              <td className="p-3">{hotel.rating}</td>
              <td className="p-3">
                <span
                  className={
                    hotel.status === "Active"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {hotel.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(hotel.id)}
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
