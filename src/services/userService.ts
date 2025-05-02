const API = process.env.NEXT_PUBLIC_API_URL;

export const getUserById = async (userId: number) => {
  const res = await fetch(`${API}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
};

export const updateUserProfile = async (userId: number, data: any) => {
  const res = await fetch(`${API}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
};

export const deleteUser = async (userId: number) => {
  const res = await fetch(`${API}/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return await res.json();
};
