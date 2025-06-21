import { useState, useEffect } from "react";
import { Search, X, Calendar, Users, Star, Filter } from "lucide-react";
import EventCard from "../../components/ui/EventCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getCategories, getEvent } from "../../api/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    skillLevel: "",
    date: "",
    location: "",
    maxParticipants: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events from API
        const eventsRes = await getEvent();

        // Handle different response formats
        let eventsData = [];
        if (eventsRes.data.events) {
          eventsData = eventsRes.data.events;
        } else if (Array.isArray(eventsRes.data)) {
          eventsData = eventsRes.data;
        } else {
          eventsData = [];
        }

        // Fetch categories from API
        let categoriesData = [];
        try {
          const categoriesRes = await getCategories();
          categoriesData = categoriesRes.data || [];
        } catch (error) {
          // Fallback to mock categories
          categoriesData = [
            { _id: "1", name: "Soccer" },
            { _id: "2", name: "Basketball" },
            { _id: "3", name: "Tennis" },
            { _id: "4", name: "Running" },
            { _id: "5", name: "Swimming" },
            { _id: "6", name: "Cycling" },
            { _id: "7", name: "Volleyball" },
            { _id: "8", name: "Badminton" },
          ];
        }

        // Filter out past events and events with no spots
        const availableEvents = eventsData.filter((event) => {
          if (!event || !event.date) return false;

          const eventDate = new Date(event.date);
          const today = new Date();
          const hasSpots =
            !event.maxParticipants ||
            (event.participants?.length || 0) < event.maxParticipants;
          const isFuture = eventDate > today;
          const isActive = !event.status || event.status === "active";

          return hasSpots && isFuture && isActive;
        });

        setEvents(availableEvents);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty arrays on error
        setEvents([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      skillLevel: "",
      date: "",
      location: "",
      maxParticipants: "",
    });
  };

  const filteredAndSortedEvents = events
    .filter((event) => {
      if (
        filters.search &&
        !event.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category && event.sportCategory?._id !== filters.category) {
        return false;
      }
      if (filters.skillLevel && event.skillLevel !== filters.skillLevel) {
        return false;
      }
      if (filters.date) {
        const eventDate = new Date(event.date).toISOString().split("T")[0];
        if (eventDate !== filters.date) {
          return false;
        }
      }
      if (
        filters.location &&
        !event.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      if (filters.maxParticipants) {
        const maxPart = Number.parseInt(filters.maxParticipants);
        if (!event.maxParticipants || event.maxParticipants > maxPart) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "participants":
          return (b.participants?.length || 0) - (a.participants?.length || 0);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "alphabetical":
          return a.title?.localeCompare(b.title) || 0;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <LoadingSpinner
        title="Finding Amazing Events"
        subtitle="Discovering the best sports activities for you..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Available Sports Events
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Join active events with available spots - no waiting, just
                playing!
              </p>

              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{events.length} Available Events</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Open Spots Available</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>Join & Play Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="relative flex-grow mb-4 lg:mb-0 lg:mr-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search available events..."
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                <Filter className="w-5 h-5 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="participants">Sort by Popularity</option>
                <option value="created">Sort by Newest</option>
                <option value="alphabetical">Sort A-Z</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sport Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="skillLevel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Skill Level
                  </label>
                  <select
                    id="skillLevel"
                    name="skillLevel"
                    value={filters.skillLevel}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City or area"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredAndSortedEvents.length} available events
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No available events found
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              {events.length === 0
                ? "No events have been created yet. Be the first to create one!"
                : "All events are either full or have passed. Check back later for new opportunities!"}
            </p>
            {(filters.search ||
              filters.category ||
              filters.skillLevel ||
              filters.date ||
              filters.location) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
