import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const EventCard = ({ event }) => {
  const { user } = useAuth();
  const {
    _id,
    title,
    description,
    sportCategory,
    date,
    time,
    location,
    maxParticipants,
    skillLevel,
    participants = [],
    image,
    organizer,
  } = event;

  const formatDate = (dateString) => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const participantCount = participants?.length || 0;
  const spotsLeft = maxParticipants ? maxParticipants - participantCount : null;

  // Check if user is already joined or is the organizer
  const isUserJoined =
    user && participants.some((p) => p._id === user._id || p === user._id);
  const isOrganizer =
    user && organizer && (organizer._id === user._id || organizer === user._id);
  const isAdmin = user && user.role === "admin";

  const getButtonText = () => {
    if (isOrganizer) return "Manage Event";
    if (isUserJoined) return "Already Joined";
    if (spotsLeft === 0) return "Event Full";
    return "Join Event";
  };

  const getButtonStyle = () => {
    if (isOrganizer)
      return "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700";
    if (isUserJoined)
      return "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed";
    if (spotsLeft === 0)
      return "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed";
    return "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500">
        {image ? (
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-20">
              {sportCategory?.name?.charAt(0) || "S"}
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full">
            {sportCategory?.name || "Sports"}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(
              skillLevel
            )}`}
          >
            {skillLevel?.charAt(0).toUpperCase() + skillLevel?.slice(1) ||
              "All Levels"}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-3 text-green-500" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-3 text-blue-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-3 text-purple-500" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-3 text-orange-500" />
            <span>
              {participantCount} / {maxParticipants || "∞"} participants
            </span>
            {spotsLeft && spotsLeft <= 3 && spotsLeft > 0 && (
              <span className="ml-2 text-red-500 text-xs font-medium">
                ({spotsLeft} spots left!)
              </span>
            )}
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">
                {organizer?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {organizer?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">Organizer</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${_id}`}
          className={`block w-full text-center px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${getButtonStyle()}`}
        >
          {getButtonText()}
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
