"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Edit2 } from "lucide-react";
import {
  fetchAllReviews,
  postResponse,
  deleteResponse,
  deleteReview,
  editResponse,
} from "@/services/reviewService";

const AdminReviewManagementPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [responseInputs, setResponseInputs] = useState<{ [key: number]: string }>({});
  const [editResponseId, setEditResponseId] = useState<number | null>(null);
  const [editResponseText, setEditResponseText] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<"All" | "Not Replied">("All");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviewsData = await fetchAllReviews();
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews. Please try again.");
      }
    };

    getReviews();
  }, []);

  useEffect(() => {
    // Apply filters whenever reviews, statusFilter, or ratingFilter changes
    let filtered = reviews;

    // Apply Status Filter
    if (statusFilter === "Not Replied") {
      filtered = filtered.filter((review) => !review.responses || review.responses.length === 0);
    }

    // Apply Rating Filter
    if (ratingFilter !== null) {
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }

    setFilteredReviews(filtered);
  }, [reviews, statusFilter, ratingFilter]);

  const handleResponseChange = (reviewId: number, value: string) => {
    setResponseInputs((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleAddResponse = async (reviewId: number) => {
    const responseText = responseInputs[reviewId];
    if (!responseText) {
      setError("Please enter a response before submitting.");
      return;
    }

    try {
      await postResponse(reviewId, responseText);
      const updatedReviews = await fetchAllReviews();
      setReviews(updatedReviews);
      setResponseInputs((prev) => ({ ...prev, [reviewId]: "" }));
      setSuccess("Response added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to add response:", err);
      setError(err.message || "Failed to add response. Please try again.");
    }
  };

  const handleDeleteResponse = async (responseId: number) => {
    if (window.confirm("Are you sure you want to delete this response?")) {
      try {
        await deleteResponse(responseId);
        const updatedReviews = await fetchAllReviews();
        setReviews(updatedReviews);
        setSuccess("Response deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Failed to delete response:", err);
        setError("Failed to delete response. Please try again.");
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        const updatedReviews = await fetchAllReviews();
        setReviews(updatedReviews);
        setSuccess("Review deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Failed to delete review:", err);
        setError("Failed to delete review. Please try again.");
      }
    }
  };

  const handleEditResponse = (responseId: number, currentText: string) => {
    setEditResponseId(responseId);
    setEditResponseText(currentText);
  };

  const handleSaveEditResponse = async (responseId: number) => {
    if (!editResponseText) {
      setError("Please enter a response before saving.");
      return;
    }

    try {
      await editResponse(responseId, editResponseText);
      const updatedReviews = await fetchAllReviews();
      setReviews(updatedReviews);
      setEditResponseId(null);
      setEditResponseText("");
      setSuccess("Response updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to edit response:", err);
      setError("Failed to edit response. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditResponseId(null);
    setEditResponseText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Management</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-6">
          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Status:</span>
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("Not Replied")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === "Not Replied"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Not Replied
            </button>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <span className="text-gray-700 font-medium">Rating:</span>
            <button
              onClick={() => setRatingFilter(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                ratingFilter === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setRatingFilter(rating)}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-1 ${
                  ratingFilter === rating
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {rating}
                <Star size={16} fill="currentColor" className="text-yellow-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {filteredReviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews match the selected filters.</p>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => {
              const hasResponse = review.responses && review.responses.length > 0;

              return (
                <div
                  key={review.reviewId}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                >
                  {/* Review Details */}
                  <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt="Review image"
                          className="w-full md:w-48 h-48 object-cover rounded-lg shadow-sm mb-4 md:mb-0"
                        />
                      ) : (
                        <div className="w-full md:w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm mb-4 md:mb-0">
                          <p className="text-gray-500 text-sm italic">No image available</p>
                        </div>
                      )}
                    </div>

                    {/* Review Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {review.ticket?.name || "Unknown Ticket"}
                        </h3>
                        <div className="relative group">
                          <button
                            onClick={() => handleDeleteReview(review.reviewId)}
                            className="p-2 rounded-full hover:bg-red-100 transition"
                          >
                            <Trash2
                              size={20}
                              className="text-red-600 hover:text-red-800"
                            />
                          </button>
                          <span className="absolute top-10 right-0 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete Review
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Reviewed by: {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center mb-3">
                        <Star
                          className="inline-block mr-2 text-yellow-500"
                          size={18}
                          fill="currentColor"
                        />
                        <span className="font-semibold text-gray-800">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed mb-4">
                        {review.comment}
                      </p>

                      {/* Existing Responses */}
                      {hasResponse && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Admin Response:
                          </h4>
                          {review.responses.map((response: any) => (
                            <div
                              key={response.responseId}
                              className="bg-blue-50 p-4 rounded-lg mb-3 shadow-sm"
                            >
                              {editResponseId === response.responseId ? (
                                <div>
                                  <textarea
                                    value={editResponseText}
                                    onChange={(e) => setEditResponseText(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                  />
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      onClick={() => handleSaveEditResponse(response.responseId)}
                                      className="bg-blue-600 text-white py-1 px-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="bg-gray-300 text-gray-800 py-1 px-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-gray-700 text-sm">
                                      {response.response}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {new Date(response.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="relative group">
                                      <button
                                        onClick={() =>
                                          handleEditResponse(response.responseId, response.response)
                                        }
                                        className="p-1 rounded-full hover:bg-blue-100 transition"
                                      >
                                        <Edit2
                                          size={16}
                                          className="text-blue-600 hover:text-blue-800"
                                        />
                                      </button>
                                      <span className="absolute top-8 right-0 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Edit Response
                                      </span>
                                    </div>
                                    <div className="relative group">
                                      <button
                                        onClick={() => handleDeleteResponse(response.responseId)}
                                        className="p-1 rounded-full hover:bg-red-100 transition"
                                      >
                                        <Trash2
                                          size={16}
                                          className="text-red-600 hover:text-red-800"
                                        />
                                      </button>
                                      <span className="absolute top-8 right-0 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Delete Response
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Response Form */}
                  {!hasResponse ? (
                    <div className="mt-4">
                      <textarea
                        value={responseInputs[review.reviewId] || ""}
                        onChange={(e) => handleResponseChange(review.reviewId, e.target.value)}
                        placeholder="Write your response..."
                        className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <button
                        onClick={() => handleAddResponse(review.reviewId)}
                        className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Submit Response
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 text-gray-500 italic">
                      A response has already been added for this review.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewManagementPage;