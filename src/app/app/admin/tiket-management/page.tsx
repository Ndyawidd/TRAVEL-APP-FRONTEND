"use client";

import TicketForm from "../../../../components/admin/TicketForm";
import TicketTable from "../../../../components/admin/TicketTable";
import { useState, useEffect } from "react";

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Gagal mengambil tiket:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const [editingTicket, setEditingTicket] = useState<any | null>(null);

  const handleAddTicket = (newTicket: any) => {
    setTickets((prev) => [...prev, newTicket]);
  };

  const handleUpdateTicket = async (updatedTicket: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${updatedTicket.ticketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTicket),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal update tiket");
      }

      const result = await res.json();
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticketId === updatedTicket.ticketId ? result : ticket
        )
      );
      setEditingTicket(null); // Reset edit state
      alert("Tiket berhasil diupdate!");
    } catch (err: any) {
      console.error("Gagal update tiket:", err);
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus tiket");
      }

      setTickets((prev) => prev.filter((ticket) => ticket.ticketId !== id));
      alert("Tiket berhasil dihapus!");
    } catch (err: any) {
      console.error("Gagal hapus tiket:", err);
      alert(err.message);
    }
  };

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-3xl font-semibold text-blue-700 mb-4">
            🎟️ Manajemen Tiket
          </h1>
          <p className="text-gray-600 mb-4">
            Tambahkan tiket baru atau kelola tiket yang sudah ada.
          </p>
          <TicketForm
            onAddTicket={handleAddTicket}
            onSuccess={fetchTickets}
            editingTicket={editingTicket}
            onCancelEdit={() => setEditingTicket(null)}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Daftar Tiket
          </h2>
          <TicketTable
            tickets={tickets}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketManagementPage;
