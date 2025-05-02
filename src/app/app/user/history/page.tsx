"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const historyData = [
  {
    id: "TPMT250412001",
    destination: "Labuan Bajo",
    location: "Bandung, Indonesia",
    status: "Successful",
    image: "/images/labuanbajo.jpg",
  },
  {
    id: "TPMT250412002",
    destination: "Bali",
    location: "Denpasar, Indonesia",
    status: "Waiting",
    image: "/images/bali.jpg",
  },
  {
    id: "TPMT250412003",
    destination: "Yogyakarta",
    location: "Yogyakarta, Indonesia",
    status: "Cancelled",
    image: "/images/yogyakarta.jpg",
  },
];

const statusColor = {
  Successful: "text-green-600",
  Waiting: "text-orange-500",
  Cancelled: "text-red-500",
};

const HistoryPage = () => {
  const [search, setSearch] = useState("");

  const filtered = historyData.filter((item) =>
    item.destination.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* List */}
        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.destination}
                className="w-32 h-32 object-cover"
              />
              <div className="flex-1 px-5 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.destination}
                  </h2>
                  <span
                    className={`text-sm font-bold ${
                      statusColor[item.status as keyof typeof statusColor]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.location}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Order ID: {item.id}
                </p>
              </div>
            </div>
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
