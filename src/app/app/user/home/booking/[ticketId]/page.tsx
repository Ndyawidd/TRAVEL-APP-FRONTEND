"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Minus, Plus, ArrowLeft } from "lucide-react";
import { fetchTicketById } from "@/services/ticketService";

export default function BookTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getTicket = async () => {
      if (ticketId) {
        const data = await fetchTicketById(Number(ticketId));
        setTicket(data);
      }
    };
    getTicket();
  }, [ticketId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleProceed = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    router.push(
      `/app/user/home/payment?ticketId=${ticketId}&date=${selectedDate}&quantity=${quantity}`
    );
  };

  if (!ticket) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  const totalPrice = quantity * ticket.price;

  return (
    <div className="min-h-screen bg-white px-8 py-10 max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-700 hover:underline mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-blue-900">Booking Details</h1>

      {/* Destination */}
      <div className="mb-6">
        <p className="flex items-center text-gray-700 font-semibold">
          <MapPin size={18} className="mr-2" /> Destination
        </p>
        <p className="text-lg text-gray-900 font-medium mt-1">{ticket.name}</p>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="flex items-center text-gray-700 font-semibold">
          <CalendarDays size={18} className="mr-2" /> Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split("T")[0]} // 🚫 Disable dates before today
          className="mt-1 w-full border rounded-lg p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ticket Quantity */}
      <div className="mb-6">
        <label className="text-gray-700 font-semibold block mb-2">
          Ticket Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="bg-gray-700 rounded-full p-2 hover:bg-gray-300"
          >
            <Minus size={16} className="text-white" />
          </button>
          <span className="text-lg font-medium text-black">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="bg-gray-700 rounded-full p-2 hover:bg-gray-300"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-8">
        <p className="text-gray-700 font-semibold">Total Price</p>
        <p className="text-xl font-bold text-green-600 mt-1">
          Rp {totalPrice.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className="w-full bg-blue-700 text-white text-center font-semibold py-3 rounded-full hover:bg-blue-800"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
