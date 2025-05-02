"use client";

import { useEffect, useState } from "react";
import { fetchTickets, Ticket } from "@/services/ticketService";
import { Heart, Star } from "lucide-react";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

const HomePage = () => {
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (user?.userId) {
      setUserId(user.userId);
    }
  }, []);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const loadTickets = async () => {
      const data = await fetchTickets();
      setTickets(data);
    };
    loadTickets();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadWishlist = async () => {
      try {
        const data = await getUserWishlist(userId);
        const ticketIds = data.map((item: any) => item.ticketId);
        setWishlist(ticketIds);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    loadWishlist();
  }, [userId]);

  const toggleWishlist = async (ticketId: number) => {
    if (!userId) return;

    try {
      if (wishlist.includes(ticketId)) {
        await removeFromWishlist(userId, ticketId);
        setWishlist((prev) => prev.filter((id) => id !== ticketId));
      } else {
        await addToWishlist(userId, ticketId);
        setWishlist((prev) => [...prev, ticketId]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Hello, User!</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(ticket.ticketId)}
                className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-md hover:bg-red-100 transition"
              >
                <Heart
                  size={20}
                  className={
                    wishlist.includes(ticket.ticketId)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }
                />
              </button>

              {/* Image */}
              <img
                src={ticket.image}
                alt={ticket.name}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {ticket.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {ticket.location}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-orange-500 font-bold">
                    Rp {ticket.price.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700">
                      {ticket.rating}
                    </span>
                  </div>
                </div>

                {/* Add to Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(ticket.ticketId)}
                  className={`mt-4 w-full py-2 text-sm font-semibold rounded-xl transition 
      ${
        wishlist.includes(ticket.ticketId)
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
      }`}
                >
                  {wishlist.includes(ticket.ticketId)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
