"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getOrdersByUser } from "@/services/orderService";
import Link from "next/link"; // Import Link from next/link

const statusColor = {
  CONFIRMED: "text-green-600", // Updated to match backend schema
  PENDING: "text-orange-500",
  CANCELLED: "text-red-500",
};

const HistoryPage = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user?.userId) return;

      try {
        const res = await getOrdersByUser(user.userId);
        setOrders(res);
        setFiltered(res);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFiltered(
      orders.filter((order) =>
        order.ticket?.name?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, orders]);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">
          Booking History
        </h1>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-3 text-blue-500" size={20} />
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {filtered.map((order) => (
            <Link
              href={`/app/user/history/detail/${order.orderId}`} // Navigate to detail page
              key={order.orderId}
              className="block" // Ensure Link is a block element
            >
              <div
                className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer" // Added cursor-pointer
              >
                <img
                  src={order.ticket?.image || "/images/placeholder.jpg"}
                  alt={order.ticket?.name}
                  className="w-32 h-32 object-cover"
                />
                <div className="flex-1 px-5 py-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {order.ticket?.name}
                    </h2>
                    <span
                      className={`text-sm font-bold ${
                        statusColor[order.status as keyof typeof statusColor] ||
                        "text-gray-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.ticket?.location}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Order ID: {order.orderId}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-400">
              No booking history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
