import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { getCities, createCity, updateCity, deleteCity } from "../../api/api";

const ManageCities = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({ name: "", state: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data || []);
    } catch (err) {
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "City name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCity = async () => {
    if (!validateForm()) return;
    setActionLoading(true);
    try {
      const response = await createCity(formData);
      setCities([...cities, response.data]);
      closeModals();
    } catch {
      setErrors({ submit: "Failed to add city" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCity = async () => {
    if (!validateForm() || !selectedCity) return;
    setActionLoading(true);
    try {
      const response = await updateCity(selectedCity._id, formData);
      setCities(
        cities.map((city) =>
          city._id === selectedCity._id ? response.data : city
        )
      );
      closeModals();
    } catch {
      setErrors({ submit: "Failed to update city" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCity = async () => {
    if (!selectedCity) return;
    setActionLoading(true);
    try {
      await deleteCity(selectedCity._id);
      setCities(cities.filter((city) => city._id !== selectedCity._id));
      closeModals();
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCity(null);
    setFormData({ name: "", state: "" });
    setErrors({});
  };

  const openEditModal = (city) => {
    setSelectedCity(city);
    setFormData({ name: city.name, state: city.state || "" });
    setShowEditModal(true);
  };

  const openDeleteModal = (city) => {
    setSelectedCity(city);
    setShowDeleteModal(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Manage Cities
              </h1>
              <p className="mt-2 text-gray-600">
                Add and manage sports cities
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add City
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div
              key={city._id}
              className="bg-white shadow rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{city.name}</h3>
                  {city.state && (
                    <p className="text-sm text-gray-500">{city.state}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(city)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(city)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showAddModal ? "Add New City" : "Edit City"}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {errors.submit}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Name*
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`block w-full px-3 py-2 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter city name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter state name (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeModals}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? handleAddCity : handleEditCity}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 disabled:opacity-50 flex items-center"
                >
                  {actionLoading ? (
                    <Spinner size="small" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {actionLoading
                    ? showAddModal
                      ? "Adding..."
                      : "Updating..."
                    : showAddModal
                    ? "Add City"
                    : "Update City"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete City
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedCity?.name}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModals}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCity}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50"
                >
                  {actionLoading ? <Spinner size="small" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCities;
