// services/authService.ts
const API = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: { username: string; password: string }) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return await res.json(); // { token, user }
};

export const registerUser = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
}) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");
  return await res.json();
};
