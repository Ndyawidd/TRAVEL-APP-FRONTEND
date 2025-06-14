"use client";

import { useEffect, useState } from "react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setImageFile(null);
    setLocationInput("");
    setSelectedLocation(null);
  };

  // Lokasi (Nominatim API)
  useEffect(() => {
    if (locationInput.length < 3) return;

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            locationInput
          )}&format=json&limit=5`
        );
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [locationInput]);

  // Upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    setImageFile(file);

    // Preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.onerror = () => {
      alert("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Pilih lokasi dari suggestion!");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = !!editingTicket;
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/tickets/${editingTicket.ticketId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tickets`;
      const method = isEdit ? "PUT" : "POST";

      // Buat FormData untuk mengirim file
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("capacity", capacity);
      formData.append("description", description);
      formData.append("location", selectedLocation.name);
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lon.toString());

      // Jika ada file gambar baru, tambahkan ke FormData
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (isEdit && image) {
        // Jika edit dan tidak ada file baru, kirim URL gambar lama
        formData.append("image", image);
      }

      console.log("Submitting form data:", {
        name,
        price,
        capacity,
        description,
        location: selectedLocation.name,
        hasNewImage: !!imageFile,
        existingImage: image,
      });

      const res = await fetch(url, {
        method,
        body: formData, // Kirim sebagai FormData, bukan JSON
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("API Error:", result);
        alert(`Gagal menyimpan tiket: ${result.error || "Unknown error"}`);
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
      console.error("Submit error:", err);
      alert(
        `Terjadi kesalahan saat menyimpan tiket: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            className="w-full p-2 rounded-lg border border-gray-300 text-black disabled:bg-gray-100"
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
              disabled={isSubmitting}
              className="w-full pl-10 p-2 rounded-lg border border-gray-300 text-black disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full p-2 rounded-lg border border-gray-300 text-black disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full p-2 rounded-lg border border-gray-300 text-black disabled:bg-gray-100"
            placeholder="Cari lokasi..."
          />
          {suggestions.length > 0 && !selectedLocation && !isSubmitting && (
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
            disabled={isSubmitting}
            className="w-full p-2 rounded-lg border border-gray-300 text-black disabled:bg-gray-100"
            rows={3}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Tiket
          </label>
          <div className="flex items-center gap-4">
            <label
              className={`cursor-pointer font-medium px-4 py-2 rounded-lg border transition duration-200 shadow-sm ${
                isSubmitting
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
              }`}
            >
              {isSubmitting ? "Memproses..." : "Tambah Gambar"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="w-28 h-28 object-cover rounded-xl border-2 border-blue-300 shadow"
                />
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage("");
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
          {!image && (
            <p className="text-sm text-gray-400 mt-2">
              Belum ada gambar dipilih. (Max 5MB, format: JPG, PNG, GIF)
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-medium transition duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Memproses...
            </span>
          ) : editingTicket ? (
            "Update Tiket"
          ) : (
            "Tambah Tiket"
          )}
        </button>

        {editingTicket && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              resetForm();
            }}
            disabled={isSubmitting}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Batal Edit
          </button>
        )}
      </div>

      {selectedLocation && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Lokasi dipilih:</strong> {selectedLocation.name}
          </p>
        </div>
      )}
    </form>
  );
};

export default TicketForm;
