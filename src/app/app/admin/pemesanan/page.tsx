// src/app/admin/pemesanan/page.tsx

"use client";

import BookingTable from "@/app/components/BookingTable";

const BookingManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">
          Manajemen Pemesanan
        </h1>
        <BookingTable />
      </div>
    </div>
  </div>
  );
};

export default BookingManagementPage;
