"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  growth: { bookings: string; revenue: string; users: string };
}

interface Booking {
  id: number;
  User: { name: string };
  Tour: { name: string };
  createdAt: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/dashboard/stats"),
          fetch("http://localhost:5000/api/dashboard/recent-bookings"),
        ]);

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();

        setStats(statsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Fetch dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <>
      {/* --- Widgets --- */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Total Bookings */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-blue-500/30 hover:border-blue-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-blue-300">
            Tổng số lượt đặt chỗ
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {stats?.totalBookings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            {stats?.growth.bookings} từ tháng trước
          </p>
        </motion.div>

        {/* Revenue */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-green-500/30 hover:border-green-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-green-300">
            Tổng doanh thu
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            {stats?.totalRevenue.toLocaleString()}đ
          </p>
          <p className="text-sm text-gray-400">
            {stats?.growth.revenue} từ tháng trước
          </p>
        </motion.div>

        {/* Active Users */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-purple-300">
            Người dùng đang hoạt động
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {stats?.activeUsers.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            {stats?.growth.users} từ tháng trước
          </p>
        </motion.div>
      </motion.div>

      {/* --- Recent Bookings Table --- */}
      <motion.div
        className="mt-6 bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-blue-300">
          Đặt chỗ gần đây
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3 font-medium">Thú tự</th>
              <th className="p-3 font-medium">Khách hàng</th>
              <th className="p-3 font-medium">Chuyến du lịch</th>
              <th className="p-3 font-medium">Ngày</th>
              <th className="p-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={b.id}
                className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
              >
                <td className="p-3">#{index+1}</td>
                <td className="p-3">{b.User?.name}</td>
                <td className="p-3">{b.Tour?.name}</td>
                <td className="p-3">
                  {new Date(b.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td
                  className={`p-3 ${
                    b.status === "confirmed"
                      ? "text-green-400"
                      : b.status === "pending"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  );
}
