"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile, getUserById } from "@/services/userService";

const AddSaldoPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.userId) {
      setUserId(user.userId);
      fetchUser(user.userId);
    }
  }, []);

  const fetchUser = async (id: number) => {
    const user = await getUserById(id);
    setCurrentBalance(user.balance || 0);
  };

  const formatRupiah = (value: string) =>
    value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  const handleTopUp = async () => {
    if (!userId || !amount || isNaN(Number(amount)))
      return alert("Invalid amount");

    const newBalance = currentBalance + Number(amount);

    try {
      await updateUserProfile(userId, { balance: newBalance });
      alert("Saldo berhasil ditambahkan!");
      router.back();
    } catch (err) {
      console.error("Failed to top up:", err);
      alert("Gagal menambahkan saldo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center">
          Top Up Saldo
        </h1>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Jumlah Saldo</label>
          <input
            type="number"
            value={formatRupiah(amount)}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="add amount here"
            className="w-full p-3 border border-gray-300 rounded-xl text-gray-800"
          />
        </div>

        <button
          onClick={handleTopUp}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Tambahkan Saldo
        </button>
      </div>
    </div>
  );
};

export default AddSaldoPage;
