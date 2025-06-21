import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Settings,
  ArrowLeft,
  Clock,
  BarChart3,
  UserCheck,
  MessageSquare,
  Shield,
  TrendingUp,
  BookOpen,
  Phone,
  Home,
  MapPin,TargetIcon

} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getAdmin, getAdminContact, getCategories, getEvent } from "../../api/api";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalCategories: 0,
    activeEvents: 0,
    totalContacts: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Use the correct endpoints that exist in your server
        const [usersRes, eventsRes, categoriesRes, contactsRes] =
          await Promise.all([
            getAdmin(headers),
            getEvent(),
            getCategories(),
            getAdminContact(headers),
          ]);

        const users = usersRes.data || [];
        const events = eventsRes.data?.events || eventsRes.data || [];
        const categories = categoriesRes.data || [];
        const contacts = contactsRes.data?.contacts || contactsRes.data || [];

        const now = new Date();
        const activeEvents = events.filter(
          (event) => new Date(event.date) > now
        );

        setStats({
          totalUsers: users.length,
          totalEvents: events.length,
          totalCategories: categories.length,
          activeEvents: activeEvents.length,
          totalContacts: contacts.length,
        });

        // Sort by creation date and take recent ones
        const sortedUsers = users.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const sortedEvents = events.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRecentUsers(sortedUsers.slice(0, 5));
        setRecentEvents(sortedEvents.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        title="Loading Admin Dashboard"
        subtitle="Preparing your administrative overview..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your SportsHive platform
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Events
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalEvents}
                </p>
                <p className="text-xs text-blue-600">
                  {stats.activeEvents} active
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCategories}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Messages
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalContacts}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Events
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeEvents}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Management */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Admin Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing Links */}
            <Link
              to="/admin/manage-users"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">
                  View and manage user accounts
                </p>
              </div>
            </Link>

            <Link
              to="/admin/manage-events"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Events</p>
                <p className="text-sm text-gray-600">
                  Oversee all sports events
                </p>
              </div>
            </Link>

            <Link
              to="/admin/manage-categories"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Categories</p>
                <p className="text-sm text-gray-600">
                  Add and edit sport categories
                </p>
              </div>
            </Link>

            <Link
              to="/admin/manage-city"
              className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl hover:from-pink-100 hover:to-pink-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Cities</p>
                <p className="text-sm text-gray-600">
                  Create and organize cities
                </p>
              </div>
            </Link>

            <Link
              to="/admin/manage-area"
              className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <TargetIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Areas</p>
                <p className="text-sm text-gray-600">
                  Define areas within cities
                </p>
              </div>
            </Link>

            <Link
              to="/admin/contact-messages"
              className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Contact Messages</p>
                <p className="text-sm text-gray-600">View user inquiries</p>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">Platform statistics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* User Experience Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Home className="w-5 h-5 mr-2" />
            User Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">User Dashboard</p>
                <p className="text-sm text-gray-600">View user experience</p>
              </div>
            </Link>

            <Link
              to="/guide"
              className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">User Guide</p>
                <p className="text-sm text-gray-600">
                  Platform help and guides
                </p>
              </div>
            </Link>

            <Link
              to="/contact"
              className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all group"
            >
              <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Contact Page</p>
                <p className="text-sm text-gray-600">User contact form</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Recent Users
              </h2>
              <Link
                to="/admin/manage-users"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                          : "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No users found</p>
            )}
          </div>

          {/* Recent Events */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Events
              </h2>
              <Link
                to="/admin/manage-events"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event._id} className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                          {event.participants?.length || 0} participants
                        </span>
                        <Link
                          to={`/events/${event._id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No events found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
