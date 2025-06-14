const API = process.env.NEXT_PUBLIC_API_URL;

export type Review = {
  serId: number;
  orderId: string;
  ticketId: number;
  rating: number;
  comment: string;
  image?: string;
};

export const postReview = async (
  review: Omit<Review, "id">
): Promise<Review | null> => {
  try {
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error("Failed to create Review");
    return await res.json();
  } catch (err) {
    console.error("createReview error:", err);
    return null;
  }
};

// export const postReview = async (reviewData: {
//   userId: number;
//   orderId: string;
//   ticketId: number;
//   rating: number;
//   comment: string;
//   image?: string;
// }) => {
//   const response = await fetch(`${API}/reviews`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(reviewData),
//   });
//   if (!response.ok && response.status !== 201)
//     throw new Error("Failed to submit review");
//   return response.json();
// };

export const fetchReviewsByTicketId = async (ticketId: number) => {
  try {
    const res = await fetch(`${API}/reviews/ticket/${ticketId}`);
    if (!res.ok) {
      throw new Error(`Review not found for ticket ID: ${ticketId}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`fetchReviewsByTicketId error (ID: ${ticketId}):`, error);
    return [];
  }
};

export const fetchAllReviews = async () => {
  try {
    const res = await fetch(`${API}/reviews`);
    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("fetchAllReviews error:", error);
    return [];
  }
};

export const postResponse = async (reviewId: number, responseText: string) => {
  const response = await fetch(`${API}/reviews/response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId, response: responseText }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add response");
  }
  return response.json();
};

export const deleteResponse = async (responseId: number) => {
  const response = await fetch(`${API}/reviews/response/${responseId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete response");
  return response.status === 204;
};

export const deleteReview = async (reviewId: number) => {
  const response = await fetch(`${API}/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete review");
  return response.status === 204;
};

export const editResponse = async (
  responseId: number,
  newResponseText: string
) => {
  const response = await fetch(`${API}/reviews/response/${responseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response: newResponseText }),
  });
  if (!response.ok) throw new Error("Failed to edit response");
  return response.json();
};

export const getReviewsByTicketId = async (ticketId) => {
  const reviews = await prisma.review.findMany({
    where: { ticketId: Number(ticketId) },
    include: {
      user: true,
      responses: true, // Include the responses relation
    },
  });
  console.log("Reviews fetched for ticketId", ticketId, ":", reviews); // Debug log
  return reviews;
};
