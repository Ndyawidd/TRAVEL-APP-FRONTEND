"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchTicketById } from "@/services/ticketService";
import { MapPin, CalendarDays, Ticket, ArrowLeft } from "lucide-react";
import { updateUserProfile, getUserById } from "@/services/userService";
import { createOrder } from "@/services/orderService";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticketId = searchParams.get("ticketId");
  const date = searchParams.get("date");
  const quantity = Number(searchParams.get("quantity") || 1);

  const [ticket, setTicket] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId;

      if (!ticketId || !date || !userId) {
        alert("Invalid payment data.");
        router.push("/app/user/home");
        return;
      }

      const data = await fetchTicketById(Number(ticketId));
      if (data) {
        setTicket(data);
        setSubtotal(data.price * quantity);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
      );
      const userData = await res.json();
      if (userData?.balance !== undefined) {
        setBalance(userData.balance);
      }
    };

    loadData();
  }, [ticketId, quantity]);

  const handlePayNow = async () => {
    if (balance === null || subtotal > balance) {
      alert("Insufficient balance.");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId;

      if (!userId) {
        alert("User not found");
        return;
      }

      // 1. Kurangi saldo di database
      const newBalance = balance - subtotal;
      await updateUserProfile(userId, { balance: newBalance });

      // Pastikan date tidak null, gunakan fallback jika perlu
      const orderDate = date ?? new Date().toISOString().slice(0, 10); // fallback ke hari ini (format YYYY-MM-DD)

      // 2. Tambah order ke database
      await createOrder({
        userId: userId,
        ticketId: Number(ticketId),
        quantity: quantity,
        date: orderDate,
      });

      // 3. Redirect ke halaman Home
      alert("Payment successful!");
      router.push("/app/user/home");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to process payment.");
    }
  };

  if (!ticket) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-700 hover:underline flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
        <h1 className="text-lg font-semibold text-black">
          Complete Your Payment
        </h1>
        <span className="text-red-500 font-semibold text-sm">57:01</span>
      </div>

      {/* Detail */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold flex items-center mb-1">
          <MapPin size={18} className="mr-2" /> Destination
        </p>
        <p className="text-gray-600">{ticket.name}</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 font-semibold flex items-center mb-1">
          <CalendarDays size={18} className="mr-2" /> Date
        </p>
        <p className="text-gray-600">{date}</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 font-semibold flex items-center mb-1">
          <Ticket size={18} className="mr-2" /> Ticket
        </p>
        <p className="text-gray-600">{quantity} pax</p>
      </div>

      {/* Payment & Subtotal */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-2">Payment Method</h2>
        <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-700">Balance</p>
            <p className="text-gray-900 font-bold">
              {balance !== null
                ? `Rp ${balance.toLocaleString("id-ID")}`
                : "Loading..."}
            </p>
          </div>
          <button
            onClick={() => router.push("/app/user/profile/addSaldo")}
            className="text-orange-500 font-semibold hover:underline"
          >
            Top Up
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold mb-6">
        <span className="text-black">Subtotal</span>
        <span className="text-black">
          Rp {subtotal.toLocaleString("id-ID")}
        </span>
      </div>

      <button
        onClick={handlePayNow}
        className="w-full bg-blue-700 text-white text-center font-semibold py-3 rounded-full hover:bg-blue-800"
      >
        Pay Now
      </button>
    </div>
  );
}
