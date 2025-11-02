"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
interface Departure {
  id: number;
  name: string;
}
interface Destination {
  id: number;
  location_id: number | string;
  name: string;
  description: string;
}

interface TourDay {
  dayNumber: number;
  title: string;
  description: string;
  destinationIds: number[];
}

interface Props {
  slug: string;
}

export default function EditTourForm({ slug }: Props) {
  const router = useRouter()
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
    departureId: 0,
    hotelId: "",
    discount: "0",
    isHotDeal: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<
    number[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [tourDays, setTourDays] = useState<TourDay[]>([]);

  // Load categories, locations, departures
  useEffect(() => {
    const fetchData = async () => {
      const [catRes, locRes, depRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/locations"),
        fetch("http://localhost:5000/api/departures"),
      ]);
      const [catData, locData, depData] = await Promise.all([
        catRes.json(),
        locRes.json(),
        depRes.json(),
      ]);
      setCategories(Array.isArray(catData.data) ? catData.data : []);
      setLocations(Array.isArray(locData.data) ? locData.data : []);
      setDepartures(Array.isArray(depData.data) ? depData.data : []);
    };
    fetchData();
  }, []);

  // Load tour info
  useEffect(() => {
    const fetchTour = async () => {
      const res = await fetch(`http://localhost:5000/api/tours/${slug}`);
      const data = await res.json();
      if (res.ok) {
        const t = data.data;
        setFormData({
          name: t.name,
          description: t.description,
          price: String(t.price),
          startDate: t.startDate,
          endDate: t.endDate,
          capacity: String(t.capacity),
          status: t.status,
          fixedCategoryId: String(t.fixedCategoryId),
          optionalCategoryIds: t.optionalCategoryIds || [],
          locationId: t.location_id || 0,
          departureId: t.departureId || 0,
          hotelId: t.hotel_id || "",
          discount: String(t.discount || 0),
          isHotDeal: t.isHotDeal || false,
        });
        setSelectedLocation(t.location_id || "");
        setSelectedDestinationIds(t.destinationIds || []);
        setTourDays(t.tourDays || []);

        // Fetch hotels & destinations for the location
        if (t.location_id) {
          const [hotelRes, destRes] = await Promise.all([
            fetch(
              `http://localhost:5000/api/locations/${t.location_id}/hotels`
            ),
            fetch(
              `http://localhost:5000/api/locations/${t.location_id}/destinations`
            ),
          ]);
          const hotelData = await hotelRes.json();
          const destData = await destRes.json();
          setHotels(hotelData.data || []);
          setDestinations(destData.data || []);
        }
      } else {
        alert("Failed to load tour data");
      }
    };
    fetchTour();
  }, [slug]);

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
  };

  const addTourDay = () => {
    setTourDays((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: "",
        description: "",
        destinationIds: [],
      },
    ]);
  };
  const removeTourDay = (index: number) => {
    setTourDays((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  };
  const handleTourDayChange = (
    index: number,
    field: keyof TourDay,
    value: string | number | number[]
  ) => {
    setTourDays((prev) => {
      const newDays = [...prev];
      newDays[index] = { ...newDays[index], [field]: value };
      return newDays;
    });
  };
  const handleTourDayDestinationToggle = (dayIndex: number, destId: number) => {
    setTourDays((prev) => {
      const newDays = [...prev];
      const day = newDays[dayIndex];
      if (day.destinationIds.includes(destId)) {
        day.destinationIds = day.destinationIds.filter((id) => id !== destId);
      } else {
        day.destinationIds.push(destId);
      }
      return newDays;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    form.append("departureId", String(Number(formData.departureId)));
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
    if (tourDays.length > 0) form.append("tourDays", JSON.stringify(tourDays));

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/tours/${slug}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    const data = await res.json();
    router.push("/tours")
    if (res.ok) {
      alert("✅ Tour updated successfully!");
    } else {
      alert(data.error || "❌ Failed to update tour");
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
          Edit Tour
        </h2>
        {/* Reuse the same form inputs as AddTourForm */}
        {/* Tour Info */}
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

          <select
            name="departureId"
            value={formData.departureId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select Departure</option>
            {departures.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
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
        {/* Tour Days */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Tour Days</h3>
          {tourDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 p-4 mb-4 rounded-lg border border-gray-600"
            >
              <div className="flex justify-between mb-2">
                <span className="text-white font-medium">
                  Day {day.dayNumber}
                </span>
                <button
                  type="button"
                  onClick={() => removeTourDay(idx)}
                  className="text-red-400"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={day.title}
                onChange={(e) =>
                  handleTourDayChange(idx, "title", e.target.value)
                }
                className="w-full p-2 rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={day.description}
                onChange={(e) =>
                  handleTourDayChange(idx, "description", e.target.value)
                }
                className="w-full p-2 rounded mb-2"
              />
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto text-white">
                {destinations.map((d) => (
                  <label key={d.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-cyan-400"
                      checked={day.destinationIds.includes(d.id)}
                      onChange={() => handleTourDayDestinationToggle(idx, d.id)}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addTourDay}
            className="py-2 px-4 bg-cyan-500 text-white rounded"
          >
            Add Day
          </button>
        </div>
        <motion.button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white mt-4 rounded-lg"
        >
          Update Tour
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
