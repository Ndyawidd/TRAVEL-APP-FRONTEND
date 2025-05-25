"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import { fetchTicketById } from "@/services/ticketService";
import { fetchReviewsByTicketId } from "@/services/reviewService";

const AllCommentsPage = () => {
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
        console.log("Reviews data:", reviewsData); // Debug log
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

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 md:px-12 md:py-14">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Ticket Details
        </button>

        {/* Ticket Info Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Reviews for {ticket.name}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {ticket.location || "Unknown Location"}
          </p>
        </div>

        {/* All Reviews Section */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            All Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Belum ada ulasan untuk tiket ini.
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  {/* User Info and Rating */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                      <img
                        src={review.user?.image || "/images/default-user.jpg"}
                        alt={review.user?.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-user.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {review.user?.name || "Anonim"}
                          </p>
                          <div className="flex items-center mt-1">
                            {review.rating ? (
                              <>
                                <Star
                                  className="text-yellow-500 mr-1"
                                  size={16}
                                  fill="currentColor"
                                />
                                <span className="text-sm font-medium text-gray-800">
                                  {review.rating}/5
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">
                                No rating
                              </span>
                            )}
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>

                  {/* Review Image */}
                  {review.image && (
                    <div className="mb-4">
                      <img
                        src={review.image}
                        alt="Review image"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}

                  {/* Review Comment */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCommentsPage;