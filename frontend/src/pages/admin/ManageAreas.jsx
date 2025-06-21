import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
  getCities,
} from "../../api/api";

const ManageAreas = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [formData, setFormData] = useState({ name: "", city: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAreas();
    fetchCities();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await getAreas();
      setAreas(response.data || []);
    } catch (err) {
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data || []);
    } catch (err) {
      setCities([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Area name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddArea = async () => {
    if (!validateForm()) return;
    setActionLoading(true);
    try {
      
      const response = await createArea(formData);
      setAreas([...areas, response.data]);
      closeModals();
    } catch {
      setErrors({ submit: "Failed to add area" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditArea = async () => {
    if (!validateForm() || !selectedArea) return;
    setActionLoading(true);
    try {
      const response = await updateArea(selectedArea._id, formData);
      setAreas(
        areas.map((area) =>
          area._id === selectedArea._id ? response.data : area
        )
      );
      closeModals();
    } catch {
      setErrors({ submit: "Failed to update area" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteArea = async () => {
    if (!selectedArea) return;
    setActionLoading(true);
    try {
      await deleteArea(selectedArea._id);
      setAreas(areas.filter((area) => area._id !== selectedArea._id));
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
    setSelectedArea(null);
    setFormData({ name: "", city: "" });
    setErrors({});
  };

  const openEditModal = (area) => {
    setSelectedArea(area);
    setFormData({
      name: area.name,
      city: area.city?._id || area.city || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (area) => {
    setSelectedArea(area);
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
                Manage Areas
              </h1>
              <p className="mt-2 text-gray-600">
                Add and manage sports areas
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Area
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div
              key={area._id}
              className="bg-white shadow rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{area.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(area)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(area)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                City: {area.city?.name || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showAddModal ? "Add New Area" : "Edit Area"}
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
                    Area Name*
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`block w-full px-3 py-2 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="Enter area name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className={`block w-full px-3 py-2 border ${
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

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeModals}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? handleAddArea : handleEditArea}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center"
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
                    ? "Add Area"
                    : "Update Area"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Area
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedArea?.name}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModals}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteArea}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50"
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

export default ManageAreas;
