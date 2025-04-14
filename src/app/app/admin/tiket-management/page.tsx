"use client";

import TicketForm from "../../../components/TicketForm";
import TicketTable from "../../../components/TicketTable";
import { useState } from "react";

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: "Trip to Bali",
      price: 2500000,
      capacity: 20,
      date: "2025-05-01",
    },
  ]);

  const [editingTicket, setEditingTicket] = useState<any | null>(null);

  const handleAddTicket = (newTicket: any) => {
    setTickets([...tickets, { ...newTicket, id: Date.now() }]);
  };

  const handleUpdateTicket = (updatedTicket: any) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setEditingTicket(null); // reset form
  };

  const handleDelete = (id: number) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
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
          onUpdateTicket={handleUpdateTicket}
          editingTicket={editingTicket}
        />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Daftar Tiket
          </h2>
          <TicketTable tickets={tickets} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default TicketManagementPage;
