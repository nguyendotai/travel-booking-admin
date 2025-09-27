"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  type: "fixed" | "optional";
}
interface Location {
  fixedCategoryId: number;
  id: number;
  name: string;
}
interface Hotel {
  id: number;
  location_id: number | string;
  name: string;
}
interface Destination {
  id: number;
  location_id: number | string;
  name: string;
  description: string;
}

export default function AddTourForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    capacity: "",
    status: "active",
    fixedCategoryId: "",
    optionalCategoryIds: [] as number[],
    locationId: 0,
    hotelId: "",
    discount: "0", // 👈 thêm
    isHotDeal: false, // 👈 thêm
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<
    number[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, locRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/locations"),
      ]);
      const [catData, locData] = await Promise.all([
        catRes.json(),
        locRes.json(),
      ]);
      setCategories(Array.isArray(catData.data) ? catData.data : []);
      setLocations(Array.isArray(locData.data) ? locData.data : []);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const locId = Number(e.target.value);
    setSelectedLocation(locId);
    setFormData((prev) => ({ ...prev, locationId: locId, hotelId: "" }));
    if (!locId) return setHotels([]), setDestinations([]);

    const [hotelRes, destRes] = await Promise.all([
      fetch(`http://localhost:5000/api/locations/${locId}/hotels`),
      fetch(`http://localhost:5000/api/locations/${locId}/destinations`),
    ]);
    const hotelData = await hotelRes.json();
    const destData = await destRes.json();
    setHotels(hotelData.data || []);
    setDestinations(destData.data || []);
    setSelectedDestinationIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.capacity ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.fixedCategoryId ||
      !formData.locationId
    ) {
      return alert("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return alert("End date cannot be before start date");
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", String(Number(formData.price)));
      form.append("capacity", String(Number(formData.capacity)));
      form.append("status", formData.status);
      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
      form.append("discount", String(Number(formData.discount)));
      form.append("isHotDeal", String(formData.isHotDeal));
      form.append("fixedCategoryId", String(Number(formData.fixedCategoryId)));
      if (formData.locationId)
        form.append("location_id", String(formData.locationId));
      if (formData.hotelId)
        form.append("hotel_id", String(Number(formData.hotelId)));
      if (selectedDestinationIds.length > 0)
        form.append("destinationIds", JSON.stringify(selectedDestinationIds));
      if (formData.optionalCategoryIds.length > 0)
        form.append(
          "optionalCategoryIds",
          JSON.stringify(formData.optionalCategoryIds)
        );
      if (image) form.append("image", image);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      const data = await res.json();
      console.log("🔍 Response từ server:", data);
      if (res.ok) {
        alert("✅ Tour created successfully!");
        console.log("New Tour:", data);

        // 👉 reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          startDate: "",
          endDate: "",
          capacity: "",
          status: "active",
          fixedCategoryId: "",
          optionalCategoryIds: [],
          locationId: 0,
          hotelId: "",
          discount: "0",
          isHotDeal: false,
        });
        setImage(null);
        setSelectedDestinationIds([]);
        setSelectedLocation("");
        setHotels([]);
        setDestinations([]);
      } else {
        alert(data.error || "❌ Failed to create tour");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Create New Tour
        </h2>

        {/* Tour Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tour name"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            min="0"
            max="100"
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={formData.isHotDeal}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isHotDeal: e.target.checked,
                }))
              }
              className="accent-cyan-400"
            />
            Hot Deal
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            name="fixedCategoryId"
            value={formData.fixedCategoryId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select Fixed Category</option>
            {categories
              .filter((c) => c.type === "fixed")
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 text-white">
            <p className="mb-2 font-semibold">Optional Categories:</p>
            <div className="grid grid-cols-2 gap-2">
              {categories
                .filter((c) => c.type === "optional")
                .map((cat) => {
                  const checked = formData.optionalCategoryIds.includes(cat.id);
                  return (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={checked}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setFormData((prev) => {
                            let updated = [...prev.optionalCategoryIds];
                            if (e.target.checked) updated.push(id);
                            else updated = updated.filter((i) => i !== id);
                            return { ...prev, optionalCategoryIds: updated };
                          });
                        }}
                        className="accent-cyan-400"
                      />
                      {cat.name}
                    </label>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Location, Hotel, Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={selectedLocation || ""}
            onChange={handleLocationChange}
            required
            disabled={!formData.fixedCategoryId}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          >
            <option value="">Select Location</option>
            {locations
              .filter(
                (loc) =>
                  loc.fixedCategoryId === Number(formData.fixedCategoryId)
              )
              .map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
          </select>

          <select
            name="hotelId"
            value={formData.hotelId}
            onChange={handleChange}
            disabled={!selectedLocation}
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
          >
            <option value="">Select Hotel</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 text-white col-span-2">
            <p className="mb-2 font-semibold">Destinations:</p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {destinations.map((d) => {
                const checked = selectedDestinationIds.includes(d.id);
                return (
                  <label key={d.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={d.id}
                      checked={checked}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedDestinationIds((prev) => {
                          let updated = [...prev];
                          if (e.target.checked) updated.push(id);
                          else updated = updated.filter((i) => i !== id);
                          return updated;
                        });
                      }}
                      className="accent-cyan-400"
                    />
                    {d.name}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description + Image */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <motion.button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white mt-4 rounded-lg"
        >
          Create Tour
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
