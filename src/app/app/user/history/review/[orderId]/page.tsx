"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/services/orderService";
import { getUserById } from "@/services/userService";
import { postReview } from "@/services/reviewService";

const statusColor = {
  CONFIRMED: "text-green-600",
  PENDING: "text-orange-500",
  CANCELLED: "text-red-500",
};

export default function ReviewOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [image, setImage] = useState<string | null>(null); // Store Base64 image
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) {
        setError("Invalid order ID.");
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(orderId);
        if (!orderData) {
          setError("Order not found.");
          setIsLoading(false);
          return;
        }
        setOrderDetails(orderData);

        const userData = await getUserById(orderData.userId);
        if (!userData) {
          setError("User not found.");
          setIsLoading(false);
          return;
        }
        setUserDetails(userData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!rating || !comment) {
      setError("Please provide a rating and comment.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.userId) {
      setError("Please log in to submit a review.");
      return;
    }

    try {
      const reviewData = {
        userId: user.userId,
        orderId,
        ticketId: orderDetails.ticketId,
        rating,
        comment,
        image: image || undefined, // Include image if uploaded
      };
      await postReview(reviewData);
      alert("Review submitted successfully!");
      router.push(`/app/user/home/detail/${orderDetails.ticketId}`); // Fixed ticketId
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (isLoading || !orderDetails || !userDetails) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-700 hover:underline mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Review Order
      </button>

      {/* Order Details */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-1/3">
            <img
              src={orderDetails.ticket?.image || "/images/placeholder.jpg"}
              alt={orderDetails.ticket?.name || "Order Image"}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {orderDetails.ticket?.name || "Unknown Destination"}
            </h2>
            <p className="text-gray-600 mb-2">
              {orderDetails.ticket?.location || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              No Pesanan: {orderDetails.orderId}
            </p>
            <p className="text-gray-600 mb-2">
              Waktu Pemesanan:{" "}
              {orderDetails.date
                ? new Date(orderDetails.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              Waktu Pembayaran:{" "}
              {orderDetails.status === "CONFIRMED" && orderDetails.updatedAt
                ? new Date(orderDetails.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Review Form */}
        <div className="text-gray-800 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
              <img
                src={userDetails.image || "/images/default-user.jpg"}
                alt={userDetails.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{userDetails.name}</p>
              <p className="text-grey-500 text-sm">{userDetails.username}</p>
            </div>
          </div>

          <div className="mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleStarClick(index)}
                className={`cursor-pointer text-2xl ${
                  index < rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="text-gray-600 w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell others about your experience"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          {/* Image Upload Input */}
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="photo-upload"
            className="w-full bg-orange-500 text-white py-2 rounded-full mb-4 flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {image ? "Photo Added" : "Add photos"}
          </label>

          {/* Preview Uploaded Image */}
          {image && (
            <div className="mb-4">
              <img
                src={image}
                alt="Uploaded Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => setImage(null)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Photo
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}