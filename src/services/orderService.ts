const API = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async (data: {
  userId: number;
  ticketId: number;
  quantity: number;
  date: string; // format: "YYYY-MM-DD"
}) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create order");

  return await res.json();
};

export const getOrdersByUser = async (userId: number) => {
  const res = await fetch(`${API}/orders/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user orders");
  return await res.json();
};

export const updateOrderStatus = async (
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
) => {
  const res = await fetch(`${API}/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order");
  return await res.json();
};

export const getOrderById = async (orderId: string) => {
  const response = await fetch(`${API}/orders/${orderId}`);
  if (!response.ok) throw new Error("Failed to fetch order");
  return response.json();
};
