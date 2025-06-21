"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Camera,
  Save,
  AlertCircle,
} from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { createEvent, getAreas, getCategories, getCities } from "../../api/api";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sportCategory: "",
    city: "",
    area: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    skillLevel: "all",
    image: null,
    requirements: "",
    contactInfo: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);

        const res1 = await getCities();
        setCities(res1.data);

        const res2 = await getAreas();
        setAreas(res2.data);

      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim())
      newErrors.description = "Event description is required";
    if (!formData.sportCategory)
      newErrors.sportCategory = "Sport category is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.time) newErrors.time = "Event time is required";
    if (!formData.location.trim())
      newErrors.location = "Event location is required";

    // Validate date is not in the past
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    if (eventDate <= new Date()) {
      newErrors.date = "Event date and time must be in the future";
    }

    // Validate max participants
    if (
      formData.maxParticipants &&
      Number.parseInt(formData.maxParticipants) < 2
    ) {
      newErrors.maxParticipants = "Maximum participants must be at least 2";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const res = await createEvent(formDataToSend);

      navigate(`/events/${res.data._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to create event. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold mb-4">Create New Event</h1>
              <p className="text-xl text-white/90">
                Organize an amazing sports event and connect with your community
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {errors.submit && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Image */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Event Image
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer font-medium"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Choose Image
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload an image to make your event more appealing
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Event Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Weekend Basketball Pickup Game"
                      className={`block w-full px-4 py-3 border ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="sportCategory"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Sport Category*
                    </label>
                    <select
                      id="sportCategory"
                      name="sportCategory"
                      value={formData.sportCategory}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${
                        errors.sportCategory
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    >
                      <option value="">Select a sport</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.sportCategory && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.sportCategory}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="skillLevel"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Skill Level
                    </label>
                    <select
                      id="skillLevel"
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Levels Welcome</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      City*
                    </label>
                    <select
                      id="cities"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${
                        errors.city ? "border-red-300" : "border-gray-300"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Date*
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border ${
                            errors.date ? "border-red-300" : "border-gray-300"
                          } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-lg font-semibold text-gray-900 mb-2"
                      >
                        Time*
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border ${
                            errors.time ? "border-red-300" : "border-gray-300"
                          } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.time && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Location*
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Central Park Basketball Court, NYC"
                        className={`block w-full pl-10 pr-4 py-3 border ${
                          errors.location ? "border-red-300" : "border-gray-300"
                        } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="maxParticipants"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Maximum Participants
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        placeholder="Leave empty for unlimited"
                        min="2"
                        className={`block w-full pl-10 pr-4 py-3 border ${
                          errors.maxParticipants
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxParticipants}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-lg font-semibold text-gray-900 mb-2"
                    >
                      Area*
                    </label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${
                        errors.area ? "border-red-300" : "border-gray-300"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    >
                      <option value="">Select a area</option>
                      {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    {errors.area && (
                      <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-semibold text-gray-900 mb-2"
                >
                  Event Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event, what to expect, what to bring, skill level requirements, etc."
                  className={`block w-full px-4 py-3 border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="requirements"
                    className="block text-lg font-semibold text-gray-900 mb-2"
                  >
                    Requirements & Equipment
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="What should participants bring? Any specific requirements?"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactInfo"
                    className="block text-lg font-semibold text-gray-900 mb-2"
                  >
                    Contact Information
                  </label>
                  <textarea
                    id="contactInfo"
                    name="contactInfo"
                    rows={4}
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="How can participants reach you? Phone, WhatsApp, etc."
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <Spinner size="small" className="mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {submitting ? "Creating Event..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
