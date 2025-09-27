"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Tour {
  id: number;
  name: string;
  description?: string;
  price: string;
  salePrice?: string; // 👈 lấy từ getter BE
  discount?: number; // 👈 %
  duration: string;
  startDate: string;
  endDate: string;
  status: string;
  tourStatus: string;
  image?: string;
  capacity?: number;
  isHotDeal?: boolean; // 👈 hot deal
}

export default function ToursManagementPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tours"); // thay URL theo BE của bạn
        const data = await res.json();
        if (data.success) {
          setTours(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <p className="text-blue-300">Loading tours...</p>;
  }

  return (
    <motion.div
      className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-300">Manage Tours</h2>
        <Link
          href="/tours/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          <FaPlus className="mr-2" /> Add New Tour
        </Link>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="p-3 font-medium">#</th>
            <th className="p-3 font-medium">Image</th>
            <th className="p-3 font-medium">Tour Name</th>
            <th className="p-3 font-medium">Price</th>
            <th className="p-3 font-medium">Discount</th>
            <th className="p-3 font-medium">Duration</th>
            <th className="p-3 font-medium">Capacity</th>
            <th className="p-3 font-medium">Hot Deal</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, index) => (
            <motion.tr
              key={tour.id}
              className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="p-3">#{index + 1}</td>
              <td className="p-3">
                <img
                  src={`http://localhost:5000${tour.image}`}
                  alt={tour.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                />
              </td>
              <td className="p-3">{tour.name}</td>

              {/* Giá và Sale */}
              <td className="p-3">
                {tour.discount && tour.discount > 0 ? (
                  <div>
                    <span className="line-through text-gray-400 mr-2">
                      ${tour.price}
                    </span>
                    <span className="text-green-400 font-bold">
                      ${tour.salePrice}
                    </span>
                  </div>
                ) : (
                  <span>${tour.price}</span>
                )}
              </td>

              {/* Discount */}
              <td className="p-3">{tour.discount ?? 0}%</td>

              {/* Duration */}
              <td className="p-3">{tour.duration}</td>

              {/* Capacity */}
              <td className="p-3">{tour.capacity ?? "N/A"}</td>

              {/* Hot deal */}
              <td className="p-3">
                {tour.isHotDeal ? (
                  <span className="text-red-400 font-bold">🔥 Hot</span>
                ) : (
                  "-"
                )}
              </td>

              {/* Trạng thái */}
              <td className="p-3">
                <span
                  className={
                    tour.tourStatus === "ongoing"
                      ? "text-green-400"
                      : tour.tourStatus === "upcoming"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {tour.tourStatus}
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
