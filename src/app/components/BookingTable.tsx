"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/ui/button";
import Image from "next/image";

type Booking = {
  orderId: string;
  user: {
    name: string;
    image: string;
  };
  ticket: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  status: "pending" | "confirmed" | "cancelled";
};

const BookingTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
    const data = await res.json();
    setBookings(data);
  };

  const handleStatusChange = async (
    orderId: string,
    status: "CONFIRMED" | "CANCELLED"
  ) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok) {
      await fetchBookings(); // refresh data
    } else {
      const error = await res.json();
      alert("Gagal mengubah status: " + error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Order ID</th>
            <th className="px-4 py-3 text-left font-semibold">User</th>
            <th className="px-4 py-3 text-left font-semibold">Tiket</th>
            <th className="px-4 py-3 text-left font-semibold">Harga</th>
            <th className="px-2 py-3 text-left font-semibold">Jumlah</th>
            <th className="px-4 py-3 text-left font-semibold">Total Harga</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-black">
          {bookings.map((b) => (
            <tr key={b.orderId}>
              <td className="px-4 py-3 font-mono">{b.orderId}</td>
              <td className="px-4 py-3 ">{b.user.name}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div>{b.ticket.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                Rp {b.ticket.price.toLocaleString()}
              </td>
              <td className="px-4 py-3">{b.quantity}</td>
              <td className="px-4 py-3 font-semibold">
                Rp {(b.ticket.price * b.quantity).toLocaleString()}
              </td>
              <td className="px-4 py-3 capitalize">{b.status}</td>
              <td className="px-4 py-3 space-x-2">
                {b.status.toUpperCase() === "PENDING" ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleStatusChange(b.orderId, "CONFIRMED");
                      }}
                      className="bg-blue-500 text-white px-4 py-1 my-1 rounded-lg hover:bg-yellow-700 transition duration-200"
                    >
                      Konfirmasi
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange(b.orderId, "CANCELLED")}
                      className="bg-grey-500 text-white px-4 py-1 my-1 rounded-lg hover:bg-yellow-700 transition duration-200"
                    >
                      Batalkan
                    </Button>
                  </>
                ) : (
                  <span className="text-gray-400 italic">No action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
