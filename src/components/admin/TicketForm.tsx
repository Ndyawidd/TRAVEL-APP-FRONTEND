"use client";

import { useEffect, useState } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "../../lib/firebase";

// // const storage = getStorage();
// // const fileRef = ref(storage, `tickets/${file.name}`);
// // await uploadBytes(fileRef, file);
// // const imageUrl = await getDownloadURL(fileRef);

const TicketForm = ({
  onAddTicket,
  editingTicket,
  onCancelEdit,
  onSuccess,
}: {
  onAddTicket: (ticket: any) => void;
  editingTicket: any | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Auto fill saat edit
  useEffect(() => {
    if (editingTicket) {
      setName(editingTicket.name ?? "");
      setPrice(editingTicket.price?.toString() ?? "");
      setCapacity(editingTicket.capacity?.toString() ?? "");
      setDescription(editingTicket.description ?? "");
      setImage(editingTicket.image ?? "");
      setLocationInput(editingTicket.location ?? "");
      setSelectedLocation({
        name: editingTicket.location,
        lat: editingTicket.latitude,
        lon: editingTicket.longitude,
      });
    } else {
      resetForm();
    }
  }, [editingTicket]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setCapacity("");
    setDescription("");
    setImage("");
    setLocationInput("");
    setSelectedLocation(null);
  };

  // Lokasi (Nominatim API)
  useEffect(() => {
    if (locationInput.length < 3) return;

    const fetchSuggestions = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationInput
        )}&format=json&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    };

    fetchSuggestions();
  }, [locationInput]);

  // Upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string); // base64 disimpan langsung ke state
    };
    reader.readAsDataURL(file);
  };

  console.log("Image URL before submit:", image);

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Pilih lokasi dari suggestion!");
      return;
    }

    const ticket = {
      name,
      price: Number(price),
      capacity: Number(capacity),
      description,
      image,
      location: selectedLocation.name,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lon,
    };

    const isEdit = !!editingTicket;
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/tickets/${editingTicket.ticketId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/tickets`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });

      const result = await res.json();

      if (!res.ok) {
        alert("Gagal menyimpan tiket: " + result.error);
        return;
      }

      alert(
        isEdit ? "Tiket berhasil diperbarui!" : "Tiket berhasil ditambahkan!"
      );

      if (isEdit) {
        onSuccess();
        onCancelEdit();
      } else {
        onAddTicket(result.data);
      }

      resetForm();
    } catch (err) {
      console.error("Gagal submit tiket:", err);
      alert("Terjadi kesalahan saat menyimpan tiket.");
    }
  };

  const formatRupiah = (value: string) =>
    value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Tiket
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Harga (Rp)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              Rp
            </span>
            <input
              type="text"
              value={formatRupiah(price)}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
              required
              className="w-full pl-10 p-2 rounded-lg border border-gray-300 text-black"
              placeholder="Masukkan harga tiket"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kapasitas
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 text-black"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Lokasi Tiket
          </label>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
              setSelectedLocation(null);
            }}
            className="w-full p-2 rounded-lg border border-gray-300 text-black"
            placeholder="Cari lokasi..."
          />
          {suggestions.length > 0 && !selectedLocation && (
            <ul className="absolute z-10 bg-white border mt-1 rounded-lg shadow max-h-40 overflow-y-auto text-black">
              {suggestions.map((place) => (
                <li
                  key={place.place_id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSelectedLocation({
                      name: place.display_name,
                      lat: parseFloat(place.lat),
                      lon: parseFloat(place.lon),
                    });
                    setLocationInput(place.display_name);
                    setSuggestions([]);
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 text-black"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Tiket
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg border border-blue-300 transition duration-200 shadow-sm">
              Tambah Gambar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {image && (
              <img
                src={image}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-xl border-2 border-blue-300 shadow"
              />
            )}
          </div>
          {!image && (
            <p className="text-sm text-gray-400 mt-2">
              Belum ada gambar dipilih.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {editingTicket ? "Update Tiket" : "Tambah Tiket"}
        </button>

        {editingTicket && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              resetForm();
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TicketForm;
