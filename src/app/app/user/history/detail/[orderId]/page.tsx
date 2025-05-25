"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/services/orderService";
import Link from "next/link";

const statusColor = {
  CONFIRMED: "text-green-600",
  PENDING: "text-orange-500",
  CANCELLED: "text-red-500",
};

export default function DetailHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) return;

      try {
        const data = await getOrderById(orderId); // Pass as string
        if (!data) {
          setError("Order not found.");
          return;
        }
        setOrderDetails(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to load order details. Please try again.");
      }
    };
    getOrderDetails();
  }, [orderId]);

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (!orderDetails) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // Determine if the "Write a Review" link should be disabled
  const isReviewDisabled = orderDetails.status !== "CONFIRMED";

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-700 hover:underline mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Review Section at Top */}
        <div className="bg-blue-100 p-4 rounded-lg mb-6 text-center">
          <p className="text-blue-800 font-semibold">Review your order</p>
          <p className="text-gray-600">
            Let's leave positive destination and write the review!
          </p>
          <Link
            href={`/app/user/history/review/${orderDetails.orderId}`} // Correct path and variable
            className={`mt-4 inline-block py-2 px-4 rounded-full ${
              isReviewDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={(e) => isReviewDisabled && e.preventDefault()} // Prevent navigation if disabled
          >
            Write a Review
          </Link>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
          {/* Image Column */}
          <div className="w-full md:w-1/3">
            <img
              src={orderDetails.ticket?.image || "/images/placeholder.jpg"}
              alt={orderDetails.ticket?.name || "Order Image"}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="w-full md:w-2/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {orderDetails.ticket?.name || "Unknown Destination"}
              </h2>
              <span
                className={`text-lg font-semibold ${
                  statusColor[
                    orderDetails.status as keyof typeof statusColor
                  ] || "text-gray-500"
                }`}
              >
                {orderDetails.status || "N/A"}
              </span>
            </div>
            <p className="text-gray-600 mb-2">
              {orderDetails.ticket?.location || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              Order ID: {orderDetails.orderId}
            </p>
            <p className="text-gray-600 mb-2">
              Order Date:{" "}
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
              Payment Date:{" "}
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
            <p className="text-gray-600 mb-2">
              Ticket Quantity: {orderDetails.quantity || 0} tickets
            </p>
            <p className="text-gray-600 mb-2">
              Total Price: Rp {orderDetails.totalPrice?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}