import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  ArrowLeft,
  Landmark,
  Map,
  Building,
  LocateFixed,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";
import {
  deleteEvent,
  getJoinEvent,
  getSingleEvents,
  leaveEvent,
} from "../../api/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOrganizer =
    event?.organizer?._id === user._id || event?.organizer === user._id;
  const isParticipant =
    isOrganizer ||
    event?.participants?.some((p) => {
      // Handle both populated and non-populated participant objects
      const participantId = typeof p === "object" ? p._id : p;
      return participantId === user._id;
    });
  const canJoin =
    event &&
    !isOrganizer &&
    !isParticipant &&
    (!event.maxParticipants ||
      event.participants.length < event.maxParticipants);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getSingleEvents(id);
        setEvent(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  

  const handleJoinEvent = async () => {
    setActionLoading(true);
    try {
      await getJoinEvent(id);
      setEvent((prev) => ({
        ...prev,
        participants: [
          ...prev.participants,
          { _id: user._id, name: user.name },
        ],
      }));
    } catch (error) {
      console.error("Error joining event:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    setActionLoading(true);
    try {
      await leaveEvent(id);
      setEvent((prev) => ({
        ...prev,
        participants: prev.participants.filter((p) => p._id !== user._id),
      }));
    } catch (error) {
      console.error("Error leaving event:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    setActionLoading(true);
    try {
      await deleteEvent(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!event) {
    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h2>
          <Link to="/events" className="text-green-600 hover:text-green-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Go Back
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          {/* <img
            src={event.image || "/placeholder.svg?height=400&width=800"}
            alt={event.title}
            className="w-full h-64 md:h-80 object-cover"
          /> */}

          {event.image ? (
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-80 object-cover flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
              <div className="text-white text-6xl font-bold opacity-20">
                {event.sportCategory?.name?.charAt(0) || "S"}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {event.sportCategory?.name || "Sports"}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                    {event.skillLevel}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <p className="text-gray-600">
                  Organized by {event.organizer.name}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                {isOrganizer ? (
                  <>
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    {isParticipant ? (
                      <button
                        onClick={handleLeaveEvent}
                        disabled={actionLoading}
                        className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Spinner size="small" />
                        ) : (
                          <UserMinus className="w-4 h-4 mr-2" />
                        )}
                        Leave Event
                      </button>
                    ) : canJoin ? (
                      <button
                        onClick={handleJoinEvent}
                        disabled={actionLoading}
                        className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Spinner size="small" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        Join Event
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                      >
                        Event Full
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />

                  <span>{event.location}</span>
                </div>

                {event.city &&
                event.city.name &&
                event.city.name !== "other" ? (
                  <div className="flex items-center text-gray-600">
                    <LocateFixed className="w-5 h-5 mr-3" />

                    <span>{event.city.name}</span>
                  </div>
                ) : (
                  ""
                )}

                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>
                    {event.participants?.length || 0}
                    {event.maxParticipants &&
                      ` / ${event.maxParticipants}`}{" "}
                    participants
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Participants
                </h3>
                {event.participants && event.participants.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {event.participants.map((participant, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-medium text-sm">
                            {participant.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-700">
                          {participant.name}
                        </span>
                        {participant._id === event.organizer._id && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Organizer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No participants yet</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Event
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
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

export default EventDetails;
