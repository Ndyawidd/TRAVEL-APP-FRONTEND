// src/components/BookingTable.tsx

"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";

type Booking = {
  id: number;
  user: string;
  trip: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
};

const BookingTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      user: "Alya Rahma",
      trip: "Trip to Bali",
      date: "2025-05-01",
      status: "pending",
    },
    {
      id: 2,
      user: "Budi Santoso",
      trip: "Trip to Lombok",
      date: "2025-06-15",
      status: "confirmed",
    },
  ]);

  const handleStatusChange = (id: number, status: "confirmed" | "cancelled") => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      )
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">User</th>
            <th className="px-6 py-3 text-left font-semibold">Trip</th>
            <th className="px-6 py-3 text-left font-semibold">Date</th>
            <th className="px-6 py-3 text-left font-semibold">Status</th>
            <th className="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="px-6 py-4">{b.user}</td>
              <td className="px-6 py-4">{b.trip}</td>
              <td className="px-6 py-4">{b.date}</td>
              <td className="px-6 py-4 capitalize">{b.status}</td>
              <td className="px-6 py-4 space-x-2">
                {b.status === "pending" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                    >
                      Konfirmasi
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange(b.id, "cancelled")}
                    >
                      Batalkan
                    </Button>
                  </>
                )}
                {b.status !== "pending" && <span className="text-gray-400 italic">No action</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
