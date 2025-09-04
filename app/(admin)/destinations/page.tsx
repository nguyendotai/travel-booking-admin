"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

interface Destination {
  id: number;
  name: string;
  description: string;
  image?: string;
  status?: string;
  Location?: { id: number; name: string };
}

export default function DestinationsManagementPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/destinations");
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa điểm đến này?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Xóa thành công");
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert(data.error || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Delete failed:", err);
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
        <h2 className="text-2xl font-semibold text-blue-300">
          Manage Destinations
        </h2>
        <Link
          href="/destinations/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 transition-transform"
        >
          <FaPlus className="mr-2" /> Add New Destination
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-300">Loading destinations...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-3 font-medium">Destination ID</th>
              <th className="p-3 font-medium">Destination Name</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest, index) => (
              <motion.tr
                key={dest.id}
                className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="p-3">#{dest.id}</td>
                <td className="p-3">{dest.name}</td>
                <td className="p-3">{dest.Location?.name || "N/A"}</td>
                <td className="p-3">
                  {dest.image ? (
                    <img
                      src={`http://localhost:5000${dest.image}`}
                      alt={dest.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>

                <td className="p-3">
                  <span
                    className={
                      dest.status === "Active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {dest.status || "Inactive"}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <Link href={`/destinations/edit/${dest.id}`}>
                    <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
