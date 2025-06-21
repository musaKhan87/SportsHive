import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash,
  Plus,
  AlertCircle,
  ArrowLeft,
  Star,
  Eye,
} from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { deleteEvent, getUserCreatedEvent, getUserJoinedEvent, leaveEvent } from "../../api/api";

const MyEvents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");
  const [events, setEvents] = useState({
    created: [],
    joined: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [createdRes, joinedRes] = await Promise.all([
          getUserCreatedEvent(),
          getUserJoinedEvent(),
        ]);

        setEvents({
          created: createdRes.data,
          joined: joinedRes.data,
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();

  }, []);

  

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteEvent(eventToDelete._id);
      setEvents({
        ...events,
        created: events.created.filter(
          (event) => event._id !== eventToDelete._id
        ),
      });
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await leaveEvent(eventId);
      setEvents({
        ...events,
        joined: events.joined.filter((event) => event._id !== eventId),
      });
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-10 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="large" />
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="mb-8">


          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                My Events
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your sports events and activities
              </p>
            </div>
            <Link
              to="/create-event"
              className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={16} className="mr-2" />
              Create New Event
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Events Created
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.created.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Events Joined
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.joined.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.created.length + events.joined.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-8 border border-white/20">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                activeTab === "created"
                  ? "text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("created")}
            >
              <div className="flex items-center justify-center">
                <Calendar size={18} className="mr-2" />
                Events I Created ({events.created.length})
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                activeTab === "joined"
                  ? "text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("joined")}
            >
              <div className="flex items-center justify-center">
                <Users size={18} className="mr-2" />
                Events I Joined ({events.joined.length})
              </div>
            </button>
          </div>

          {/* Event List */}
          <div className="divide-y divide-gray-100">
            {events[activeTab].length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "created" ? (
                    <Calendar className="w-12 h-12 text-white" />
                  ) : (
                    <Users className="w-12 h-12 text-white" />
                  )}
                </div>
                <p className="text-gray-500 mb-6 text-lg">
                  {activeTab === "created"
                    ? "You haven't created any events yet."
                    : "You haven't joined any events yet."}
                </p>
                {activeTab === "created" ? (
                  <Link
                    to="/create-event"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Your First Event
                  </Link>
                ) : (
                  <Link
                    to="/events"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg"
                  >
                    <Eye size={18} className="mr-2" />
                    Find Events to Join
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 p-6">
                {events[activeTab].map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/50 rounded-xl p-6 hover:bg-white/70 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg mr-3">
                            {event.title}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-medium rounded-full">
                            {event.sportCategory?.name ||
                              event.sportCategory ||
                              "Sports"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Calendar
                              size={16}
                              className="mr-2 text-green-500"
                            />
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock size={16} className="mr-2 text-blue-500" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin
                              size={16}
                              className="mr-2 text-purple-500"
                            />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Users size={16} className="mr-2 text-orange-500" />
                            <span>
                              {event.participants?.length || 0} /{" "}
                              {event.maxParticipants || "∞"}
                            </span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {activeTab === "created" ? (
                          <>
                            <Link
                              to={`/edit-event/${event._id}`}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-all"
                              title="Edit Event"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => confirmDelete(event)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete Event"
                            >
                              <Trash size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleLeaveEvent(event._id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                            title="Leave Event"
                          >
                            Leave Event
                          </button>
                        )}
                        <Link
                          to={`/events/${event._id}`}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 text-red-500">
                <AlertCircle size={24} />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Event
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete "{eventToDelete?.title}"? This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center"
              >
                {deleteLoading ? <Spinner size="small" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
