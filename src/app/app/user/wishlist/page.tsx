"use client";

import { useEffect, useState } from "react";
import { Heart, Search, Trash } from "lucide-react";
import {
  getUserWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

const WishlistPage = () => {
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (user?.userId) {
      setUserId(user.userId);
    }
  }, []);

  const [userId, setUserId] = useState<number | null>(null);
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (userId === null) return;

    const fetchWishlist = async () => {
      try {
        const data = await getUserWishlist(userId);
        const mapped = data.map((item: any) => ({
          wishlistId: item.wishlistId,
          ticketId: item.ticket.ticketId,
          name: item.ticket.name,
          location: item.ticket.location,
          price: item.ticket.price,
          image: item.ticket.image,
        }));
        setWishlistData(mapped);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    fetchWishlist();
  }, [userId]); // ← tergantung userId

  const handleRemove = async (ticketId: number) => {
    if (!userId) return;
    try {
      await removeFromWishlist(userId, ticketId);
      setWishlistData((prev) =>
        prev.filter((item) => item.ticketId !== ticketId)
      );
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const filteredList = wishlistData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">Your Wishlist</h1>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-3 text-blue-500" size={20} />
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((item) => (
            <div
              key={item.ticketId}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">{item.location}</p>
                  </div>
                  <button onClick={() => handleRemove(item.ticketId)}>
                    <Trash
                      className="text-red-500 hover:text-red-700"
                      size={20}
                    />
                  </button>
                </div>
                <p className="mt-4 text-lg font-bold text-blue-700">
                  Rp. {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredList.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            No wishlist items found.
          </p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
