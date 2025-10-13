"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";

interface Booking {
  id: number;
  Tour: {
    name: string;
  };
  User: {
    name: string;
    email: string;
  };
  Payment: {
    method: string;
    status: string;
  };
  quantity: number;
  total_price: number;
  status: string;
  createdAt: string;
}

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [notify, setNotify] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    message: "",
  });

  const showNotify = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setNotify({ show: true, type, message });
  };

  const closeNotify = () => setNotify({ ...notify, show: false });

  // Gọi API lấy danh sách booking
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/bookings/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách booking");
        const data = await res.json();
        setBookings(data.data || []);
      } catch (error) {
        showNotify("error", "Không thể tải danh sách booking!");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Cập nhật trạng thái booking
  const handleStatusChange = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("warning", "Bạn cần đăng nhập để thực hiện hành động này!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        showNotify("success", "Cập nhật trạng thái thành công!");
      } else {
        showNotify("error", data.error || "Lỗi cập nhật trạng thái!");
      }
    } catch (error) {
      showNotify("error", "Không thể cập nhật trạng thái!");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Đang tải...</p>;
  }

  return (
    <>
      <Notification
        type={notify.type}
        message={notify.message}
        show={notify.show}
        onClose={closeNotify}
      />

      <motion.div
        className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-300">
            Quản lí đơn đặt tour
          </h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Tour</th>
              <th className="p-3 font-medium">Khách hàng</th>
              <th className="p-3 font-medium">Số lượng</th>
              <th className="p-3 font-medium">Tổng tiền</th>
              <th className="p-3 font-medium">Phương thức</th>
              <th className="p-3 font-medium">Thanh toán</th>
              <th className="p-3 font-medium">Trạng thái</th>
              <th className="p-3 font-medium">Ngày đặt</th>
              <th className="p-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                className="border-t border-gray-700 hover:bg-blue-900/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="p-3">{booking.id}</td>
                <td className="p-3">{booking.Tour?.name || "—"}</td>
                <td className="p-3">
                  {booking.User?.name || "—"} <br />
                  <span className="text-gray-400 text-sm">
                    {booking.User?.email}
                  </span>
                </td>
                <td className="p-3">{booking.quantity}</td>
                <td className="p-3">
                  {booking.total_price.toLocaleString("vi-VN")}₫
                </td>
                <td className="p-3 capitalize">{booking.Payment?.method}</td>
                <td
                  className={`p-3 font-semibold ${
                    booking.Payment?.status === "paid"
                      ? "text-green-400"
                      : booking.Payment?.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {booking.Payment?.status === "paid"
                    ? "Đã thanh toán"
                    : booking.Payment?.status === "pending"
                    ? "Chờ thanh toán"
                    : "Thất bại"}
                </td>

                <td
                  className={`p-3 ${
                    booking.status === "confirmed"
                      ? "text-green-400"
                      : booking.status === "cancelled"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {booking.status}
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(booking.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="p-3 flex space-x-2">
                  {booking.status !== "confirmed" &&
                    booking.Payment?.status !== "paid" && (
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "confirmed")
                        }
                        className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
                      >
                        Xác nhận
                      </button>
                    )}

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, "cancelled")
                      }
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  );
}
