"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Widget 1 */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-blue-500/30 hover:border-blue-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-blue-300">
            Total Bookings
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            1,234
          </p>
          <p className="text-sm text-gray-400">+5% from last month</p>
        </motion.div>

        {/* Widget 2 */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-green-500/30 hover:border-green-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-green-300">
            Total Revenue
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            $56,789
          </p>
          <p className="text-sm text-gray-400">+10% from last month</p>
        </motion.div>

        {/* Widget 3 */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold mb-2 text-purple-300">
            Active Users
          </h2>
          <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            456
          </p>
          <p className="text-sm text-gray-400">+2% from last month</p>
        </motion.div>
      </motion.div>

      {/* Recent Bookings Table */}
      <motion.div
        className="mt-6 bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-blue-300">
          Recent Bookings
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3 font-medium">Booking ID</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Tour</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700 hover:bg-blue-900/30 transition-all">
              <td className="p-3">#1234</td>
              <td className="p-3">John Doe</td>
              <td className="p-3">Hanoi Tour</td>
              <td className="p-3">2025-09-01</td>
              <td className="p-3 text-green-400">Confirmed</td>
            </tr>
            <tr className="border-t border-gray-700 hover:bg-blue-900/30 transition-all">
              <td className="p-3">#1235</td>
              <td className="p-3">Jane Smith</td>
              <td className="p-3">Sapa Adventure</td>
              <td className="p-3">2025-09-02</td>
              <td className="p-3 text-yellow-400">Pending</td>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </>
  );
}
