"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  type: "fixed" | "optional";
}

interface Location {
  id: number;
  name: string;
}

interface Hotel {
  location_id: string | number;
  id: number;
  name: string;
}

interface Destination {
  location_id: string | number;
  id: number;
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
    duration: "",
    capacity: "",
    status: "active",
    fixedCategoryId: "",
    optionalCategoryIds: [] as number[],
    locationId: 0,
    hotelId: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | "">("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<
    number[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes, hotelRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/locations"),
          fetch("http://localhost:5000/api/hotels"),
        ]);

        const [catData, locData, hotelData] = await Promise.all([
          catRes.json(),
          locRes.json(),
          hotelRes.json(),
        ]);

        setCategories(catData);
        setLocations(locData);
        setHotels(hotelData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: "optionalCategoryIds" | "locationIds"
  ) => {
    const values = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    );
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          duration: Number(formData.duration),
          capacity: Number(formData.capacity),
          fixedCategoryId: Number(formData.fixedCategoryId),
          locationIds: selectedLocation ? [selectedLocation] : [],
          hotelIds: formData.hotelId ? [Number(formData.hotelId)] : [],
          destinationIds: selectedDestinationIds,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Tour created successfully!");
        console.log("New Tour:", data);
      } else {
        alert(data.error || "Failed to create tour");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const locId = Number(e.target.value);
    setSelectedLocation(locId);

    setFormData((prev) => ({
      ...prev,
      locationId: locId,
      hotelId: "", // reset hotel khi đổi location
    }));

    if (locId) {
      try {
        const [hotelRes, destRes] = await Promise.all([
          fetch(`http://localhost:5000/api/locations/${locId}/hotels`),
          fetch(`http://localhost:5000/api/locations/${locId}/destinations`),
        ]);
        const hotelData = await hotelRes.json();
        const destData = await destRes.json();
        setHotels(hotelData);
        setDestinations(destData);
        setSelectedDestinationIds([]);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      }
    } else {
      setHotels([]);
      setDestinations([]);
      setSelectedDestinationIds([]); // nếu không chọn location thì clear hotels
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
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Create New Tour
        </h2>

        {/* Tour Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Tour Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tour name"
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Categories & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Fixed Category
            </label>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Optional Categories
            </label>
            <select
              multiple
              value={formData.optionalCategoryIds.map(String)}
              onChange={(e) => handleMultiSelect(e, "optionalCategoryIds")}
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-24"
            >
              {categories
                .filter((c) => c.type === "optional")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Locations & Hotel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Location
            </label>
            <select
              value={selectedLocation || ""}
              onChange={handleLocationChange}
              required
              disabled={!formData.fixedCategoryId} // 🔥 disable khi chưa có fixedCategory
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Hotel
            </label>
            <select
              name="hotelId"
              value={formData.hotelId}
              onChange={handleChange}
              disabled={!selectedLocation} // nếu chưa chọn location thì disable
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600"
            >
              <option value="">Select Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Destinations
            </label>
            <select
              multiple
              value={selectedDestinationIds.map(String)}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, (opt) =>
                  Number(opt.value)
                );
                setSelectedDestinationIds(values);
              }}
              className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 h-24"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter tour description"
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-32"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Tour
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
