// services/ticketService.ts

export type Ticket = {
  ticketId: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch all tickets from the backend
 */
export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    const res = await fetch(`${API_URL}/tickets`);
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return await res.json();
  } catch (err) {
    console.error("fetchTickets error:", err);
    return [];
  }
};

/**
 * Fetch single ticket by ID
 */
export const fetchTicketById = async (id: number): Promise<Ticket | null> => {
  try {
    const res = await fetch(`${API_URL}/tickets/${id}`);
    if (!res.ok) throw new Error("Ticket not found");
    return await res.json();
  } catch (err) {
    console.error(`fetchTicketById error (ID: ${id}):`, err);
    return null;
  }
};

/**
 * Create a new ticket
 */
export const createTicket = async (
  ticket: Omit<Ticket, "id">
): Promise<Ticket | null> => {
  try {
    const res = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error("Failed to create ticket");
    return await res.json();
  } catch (err) {
    console.error("createTicket error:", err);
    return null;
  }
};

/**
 * Delete a ticket
 */
export const deleteTicket = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (err) {
    console.error(`deleteTicket error (ID: ${id}):`, err);
    return false;
  }
};
