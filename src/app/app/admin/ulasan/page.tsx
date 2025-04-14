'use client';

import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import Button from "@/app/components/ui/button";

interface Review {
  id: number;
  user: string;
  comment: string;
  reply?: string;
}

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, user: "Ali", comment: "Perjalanan sangat menyenangkan!" },
    { id: 2, user: "Rina", comment: "Pelayanan bagus, tapi bus kurang bersih." },
  ]);

  const handleReply = (id: number, reply: string) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, reply } : r)
    );
  };

  const handleDelete = (id: number) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Manajemen Ulasan</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white shadow-md rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">User: {review.user}</p>
            <p className="text-gray-800 mb-3 italic">"{review.comment}"</p>

            {review.reply ? (
              <div className="bg-blue-100 text-blue-700 p-2 rounded mb-2">
                Balasan: {review.reply}
              </div>
            ) : (
              <ReplyForm
                onReply={(reply) => handleReply(review.id, reply)}
              />
            )}

            <Button variant="outline" onClick={() => handleDelete(review.id)}>
              Hapus Ulasan
            </Button>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
};

const ReplyForm = ({ onReply }: { onReply: (reply: string) => void }) => {
  const [text, setText] = useState("");

  return (
    <div className="mb-2">
      <Textarea
        placeholder="Tulis balasan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-2"
      />
      <Button
        variant="primary"
        onClick={() => {
          onReply(text);
          setText("");
        }}
      >
        Kirim Balasan
      </Button>
    </div>
  );
};

export default ReviewManagementPage;
