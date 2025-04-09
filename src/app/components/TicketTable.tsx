"use client";

const TicketTable = ({
  tickets,
  onDelete,
  onEdit,
}: {
  tickets: any[];
  onDelete: (id: number) => void;
  onEdit: (ticket: any) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200 rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Nama Tiket</th>
            <th className="px-4 py-2 text-left">Harga</th>
            <th className="px-4 py-2 text-left">Kapasitas</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{ticket.name}</td>
              <td className="px-4 py-2">Rp {ticket.price.toLocaleString()}</td>
              <td className="px-4 py-2">{ticket.capacity}</td>
              <td className="px-4 py-2">{ticket.date}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(ticket)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(ticket.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Tidak ada tiket yang tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
