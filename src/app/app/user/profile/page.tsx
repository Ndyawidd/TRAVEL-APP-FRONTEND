"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import {
  updateUserProfile,
  getUserById,
  deleteUser,
} from "@/services/userService";

const ProfilePage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    image: "",
    role: "",
    password: "",
    balance: 0,
  });

  // Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.userId) {
      setUserId(user.userId);
    }
  }, []);

  // Fetch user detail dari backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const user = await getUserById(userId);
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image || "",
        password: user.password,
        balance: user.balance || 0,
      });
      console.log("Fetched user data:", user);
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      console.log("Sending formData to backend:", formData);
      await updateUserProfile(userId, formData);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Gagal update profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleDelete = async () => {
    if (!userId) return;

    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await deleteUser(userId);
      localStorage.clear();
      alert("Account deleted.");
      window.location.href = "app/login";
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete account.");
    }
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
      setFormData((prev) => ({
        ...prev,
        image: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
      <div className="w-full max-w-xl space-y-8">
        <h1 className="text-4xl font-bold text-blue-800">Profile</h1>

        {/* Profile Image */}
        <div className="flex justify-center">
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <img
              src={formData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            {isEditing && (
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            )}
          </label>
        </div>

        {/* Edit Form */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="text-sm text-gray-500">Username</label>
            {isEditing ? (
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-gray-300 text-gray-700"
              />
            ) : (
              <p className="mt-1 text-lg font-bold text-gray-800">
                {formData.username}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-gray-300 text-gray-700"
              />
            ) : (
              <p className="mt-1 text-lg font-semibold text-gray-800">
                {formData.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-gray-300 text-gray-700"
              />
            ) : (
              <p className="mt-1 text-lg font-semibold text-gray-800">
                {formData.email}
              </p>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-gray-300 text-gray-700"
              />
            </div>
          )}

          {isEditing ? (
            <button
              onClick={async () => {
                await handleSave();
                setIsEditing(false);
              }}
              className="flex items-center gap-2 justify-center w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <Save size={20} />
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 justify-center w-full bg-blue-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl font-semibold transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Saldo */}
        <div className="flex items-center justify-between bg-blue-600 text-white p-6 rounded-xl shadow-md">
          <div>
            <p className="text-sm text-blue-100">Saldo Anda</p>
            <p className="text-2xl font-bold">
              Rp {formData.balance.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={() => router.push("profile/addSaldo")}
            className="bg-orange-500 hover:bg-orange-600 p-3 rounded-full transition"
          >
            <Plus className="text-white" size={20} />
          </button>
        </div>

        {/* Delete Account */}
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
