"use client";

import { useEffect, useState } from "react";

const TicketForm = ({
  onAddTicket,
  onUpdateTicket,
  editingTicket,
}: {
  onAddTicket: (ticket: any) => void;
  onUpdateTicket: (ticket: any) => void;
  editingTicket: any | null;
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTicket) {
      setName(editingTicket.name);
      setPrice(editingTicket.price.toString());
      setCapacity(editingTicket.capacity.toString());
      setDate(editingTicket.date);
    } else {
      setName("");
      setPrice("");
      setCapacity("");
      setDate("");
    }
  }, [editingTicket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = {
      id: editingTicket?.id ?? Date.now(),
      name,
      price: Number(price),
      capacity: Number(capacity),
      date,
    };

    if (editingTicket) {
      onUpdateTicket(ticket);
    } else {
      onAddTicket(ticket);
    }

    setName("");
    setPrice("");
    setCapacity("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* input fields seperti sebelumnya */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Tiket</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Harga</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {editingTicket ? "Update Tiket" : "Tambah Tiket"}
      </button>
    </form>
  );
};

export default TicketForm;
