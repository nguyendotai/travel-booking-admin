"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface NotificationProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Notification({
  type = "info",
  message,
  show,
  onClose,
}: NotificationProps) {
  // Tự động ẩn sau 3 giây
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const colors = {
    success: "bg-green-500/20 border-green-400 text-green-300",
    error: "bg-red-500/20 border-red-400 text-red-300",
    warning: "bg-yellow-500/20 border-yellow-400 text-yellow-300",
    info: "bg-blue-500/20 border-blue-400 text-blue-300",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg border shadow-lg backdrop-blur-md ${colors[type]} flex items-center gap-2`}
        >
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
