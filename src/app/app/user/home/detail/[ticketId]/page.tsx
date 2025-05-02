"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, ArrowLeft } from "lucide-react";
import { fetchTicketById } from "@/services/ticketService";

interface Props {
  params: {
    ticketId: string;
  };
}

const DetailTicket = () => {
  const router = useRouter();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    const getTicket = async () => {
      if (!ticketId) return;
      const data = await fetchTicketById(Number(ticketId));
      setTicket(data);
    };
    getTicket();
  }, [ticketId]);

  if (!ticket) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-12 py-14">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </button>

        {/* Image */}
        <img
          src={ticket.image}
          alt={ticket.name}
          className="w-full h-[450px] object-cover rounded-2xl shadow-lg mb-8"
        />

        {/* Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{ticket.name}</h1>
            <p className="text-base text-gray-500 mt-1">
              {ticket.location || "Unknown Location"}
            </p>
          </div>
          <p className="text-3xl text-red-600 font-bold">
            Rp {ticket.price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 border rounded-xl p-5 bg-white shadow mb-8">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" size={20} />
            <span className="text-gray-800 font-medium">{ticket.rating}</span>
            <span className="text-gray-500">Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" fill="currentColor" size={20} />
            <span className="text-gray-800 font-medium">123</span>
            <span className="text-gray-500">Wishlists</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10 text-gray-700 leading-relaxed text-justify">
          {ticket.description ||
            "This is a sample description of the destination. It provides details about the location, attractions, and anything the user should know before visiting."}
        </div>

        {/* Comments */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-blue-50 p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="mb-2 font-semibold text-gray-800">
                <Star
                  className="inline-block mr-1 text-yellow-500"
                  size={16}
                  fill="currentColor"
                />
                4/5 - Lee Haechan
              </p>
              <p className="text-sm text-gray-600">
                Tempatnya asik untuk pergi bersama keluarga
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="w-40 border border-blue-600 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-100 transition">
            Map
          </button>
          <button
            onClick={() => router.push(`/app/user/home/booking/${ticketId}`)}
            className="w-40 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailTicket;
