const API = process.env.NEXT_PUBLIC_API_URL;

// ✅ GET wishlist by user
export const getUserWishlist = async (userId: number) => {
  const res = await fetch(`${API}/wishlists/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return await res.json();
};

export const addToWishlist = async (userId: number, ticketId: number) => {
  console.log("Sending wishlist data:", { userId, ticketId }); // ✅

  const res = await fetch(`${API}/wishlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ticketId }),
  });

  if (!res.ok) throw new Error("Failed to add to wishlist");
  return await res.json();
};

// ✅ REMOVE from wishlist
export const removeFromWishlist = async (userId: number, ticketId: number) => {
  const res = await fetch(`${API}/wishlists`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ticketId }),
  });

  if (!res.ok) throw new Error("Failed to remove from wishlist");
  return await res.json();
};
