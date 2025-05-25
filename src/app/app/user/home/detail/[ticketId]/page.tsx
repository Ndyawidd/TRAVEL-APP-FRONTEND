"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, ArrowLeft } from "lucide-react";
import { fetchTicketById } from "@/services/ticketService";
import { fetchReviewsByTicketId } from "@/services/reviewService";
import Link from "next/link";

interface Props {
  params: {
    ticketId: string;
  };
}

const DetailTicket = () => {
  const router = useRouter();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTicketAndReviews = async () => {
      if (!ticketId) {
        setError("Invalid ticket ID.");
        return;
      }

      try {
        const ticketData = await fetchTicketById(Number(ticketId));
        if (!ticketData) {
          setError("Ticket not found.");
          return;
        }
        setTicket(ticketData);

        const reviewsData = await fetchReviewsByTicketId(Number(ticketId));
        console.log("Reviews data with responses:", reviewsData); // Debug log
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch ticket or reviews:", err);
        setError("Failed to load ticket details or reviews. Please try again.");
      }
    };

    getTicketAndReviews();
  }, [ticketId]);

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // Show only the first 2 reviews
  const previewReviews = reviews.slice(0, 2);

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
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            <span>Comments</span>
            {reviews.length > 2 && (
              <Link
                href={`/app/user/home/comment/${ticketId}`}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Show All >
              </Link>
            )}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada review untuk tiket ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewReviews.map((review) => {
                const hasResponse = review.responses && review.responses.length > 0;

                return (
                  <div
                    key={review.reviewId}
                    className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
                  >
                    {/* Image Section */}
                    {review.image ? (
                      <div className="mb-4">
                        <img
                          src={review.image}
                          alt="Review image"
                          className="w-full h-40 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4 italic">
                        No image available
                      </p>
                    )}

                    {/* Review Details */}
                    <div className="flex items-center mb-3">
                      <Star
                        className="inline-block mr-2 text-yellow-500"
                        size={18}
                        fill="currentColor"
                      />
                      <span className="font-semibold text-gray-800">
                        {review.rating || "N/A"}/5
                      </span>
                      <span className="ml-2 text-gray-600">
                        - {review.user?.name || "Anonim"}
                      </span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {/* Responses Section */}
                    {hasResponse && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Admin Response:
                        </h4>
                        {review.responses.map((response: any) => (
                          <div
                            key={response.responseId}
                            className="bg-blue-50 p-4 rounded-lg mb-3 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-gray-700 text-sm">
                                  {response.response}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {response.createdAt
                                    ? new Date(response.createdAt).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Date unavailable"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {reviews.length > 2 && (
                <p className="text-gray-500 text-center mt-4">
                  {reviews.length - 2} more comments. Click "Show All" to see them!
                </p>
              )}
            </div>
          )}
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