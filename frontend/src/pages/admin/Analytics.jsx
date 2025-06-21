import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getCategories, getEvent, getUserData, getUsers } from "../../api/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    userGrowth: [],
    eventsByCategory: [],
    monthlyActivity: [],
    topCategories: [],
    recentStats: {
      newUsersThisWeek: 0,
      newEventsThisWeek: 0,
      participationsThisWeek: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch users with proper error handling
      let users = [];
      try {
        const usersRes = await getUsers();
        users = usersRes.data || [];
      } catch (error) {
        console.log(
          "Admin users endpoint not available, trying regular users endpoint"
        );
        try {
          const usersRes = await getUserData();
          users = usersRes.data || [];
        } catch (error2) {
          console.log("Users data not available");
        }
      }

      // Fetch events with proper error handling
      let events = [];
      try {
        const eventsRes = await getEvent();
        events = eventsRes.data?.events || eventsRes.data || [];
      } catch (error) {
        console.log("Events data not available");
      }

      // Fetch categories with proper error handling
      let categories = [];
      try {
        const categoriesRes = await getCategories();
        categories = categoriesRes.data || [];
      } catch (error) {
        console.log("Categories data not available");
      }

  

      // Calculate analytics
      const totalUsers = users.length;
      const totalEvents = events.length;
      const activeEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        const today = new Date();
        return eventDate > today && event.status === "active";
      }).length;

      const totalParticipants = events.reduce((total, event) => {
        return total + (event.participants?.length || 0);
      }, 0);

      // Calculate user growth based on time range
      const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;
      const userGrowth = [];
      const now = new Date();
      for (let i = months - 1; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString("en-US", {
          month: "short",
        });
        const usersInMonth = users.filter((user) => {
          const userDate = new Date(user.createdAt);
          return (
            userDate.getMonth() === monthDate.getMonth() &&
            userDate.getFullYear() === monthDate.getFullYear()
          );
        }).length;
        userGrowth.push({ month: monthName, users: usersInMonth });
      }

      // Calculate events by category
      const eventsByCategory = categories
        .map((category) => {
          const categoryEvents = events.filter(
            (event) =>
              event.sportCategory?._id === category._id ||
              event.sportCategory === category._id
          ).length;
          return { name: category.name, count: categoryEvents };
        })
        .filter((item) => item.count > 0);

      // Calculate monthly activity
      const monthlyActivity = [];
      for (let i = months - 1; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString("en-US", {
          month: "short",
        });
        const eventsInMonth = events.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === monthDate.getMonth() &&
            eventDate.getFullYear() === monthDate.getFullYear()
          );
        }).length;
        const participantsInMonth = events
          .filter((event) => {
            const eventDate = new Date(event.date);
            return (
              eventDate.getMonth() === monthDate.getMonth() &&
              eventDate.getFullYear() === monthDate.getFullYear()
            );
          })
          .reduce(
            (total, event) => total + (event.participants?.length || 0),
            0
          );
        monthlyActivity.push({
          month: monthName,
          events: eventsInMonth,
          participants: participantsInMonth,
        });
      }

      // Calculate recent stats (last 7 days)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newUsersThisWeek = users.filter(
        (user) => new Date(user.createdAt) > weekAgo
      ).length;
      const newEventsThisWeek = events.filter(
        (event) => new Date(event.createdAt) > weekAgo
      ).length;
      const participationsThisWeek = events
        .filter((event) => new Date(event.createdAt) > weekAgo)
        .reduce((total, event) => total + (event.participants?.length || 0), 0);

      // Top categories
      const topCategories = eventsByCategory
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalUsers,
        totalEvents,
        activeEvents,
        totalParticipants,
        userGrowth,
        eventsByCategory,
        monthlyActivity,
        topCategories,
        recentStats: {
          newUsersThisWeek,
          newEventsThisWeek,
          participationsThisWeek,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

 

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <LoadingSpinner
        title="Loading Analytics"
        subtitle="Calculating insights from your data..."
      />
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    trend,
    percentage,
  }) => (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-14 h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 mr-1 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {trend >= 0 ? "+" : ""}
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      {percentage && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/admin"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Comprehensive insights and statistics about your platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="12m">Last 12 months</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={analytics.totalUsers}
            subtitle="Registered members"
            color="from-blue-500 to-blue-600"
            trend={analytics.recentStats.newUsersThisWeek}
            percentage={
              (analytics.totalUsers / Math.max(analytics.totalUsers, 100)) * 100
            }
          />
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={analytics.totalEvents}
            subtitle="All time events"
            color="from-green-500 to-green-600"
            trend={analytics.recentStats.newEventsThisWeek}
            percentage={
              (analytics.totalEvents / Math.max(analytics.totalEvents, 50)) *
              100
            }
          />
          <StatCard
            icon={Activity}
            title="Active Events"
            value={analytics.activeEvents}
            subtitle="Upcoming events"
            color="from-purple-500 to-purple-600"
            percentage={
              (analytics.activeEvents / Math.max(analytics.totalEvents, 1)) *
              100
            }
          />
          <StatCard
            icon={Target}
            title="Total Participants"
            value={analytics.totalParticipants}
            subtitle="Event participations"
            color="from-orange-500 to-orange-600"
            trend={analytics.recentStats.participationsThisWeek}
            percentage={
              (analytics.totalParticipants /
                Math.max(analytics.totalParticipants, 200)) *
              100
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <LineChart className="w-6 h-6 mr-2 text-blue-500" />
                User Growth (
                {timeRange === "3m"
                  ? "3"
                  : timeRange === "6m"
                  ? "6"
                  : "12"}{" "}
                months)
              </h3>
            </div>
            {analytics.userGrowth.length > 0 ? (
              <div className="space-y-4">
                {analytics.userGrowth.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600 font-medium">
                      {item.month}
                    </span>
                    <div className="flex items-center flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              (item.users /
                                Math.max(
                                  ...analytics.userGrowth.map((g) => g.users)
                                )) *
                                100,
                              5
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 ml-3 min-w-[2rem]">
                        {item.users}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <LineChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No user growth data available</p>
              </div>
            )}
          </div>

          {/* Monthly Activity */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
                Monthly Activity
              </h3>
            </div>
            {analytics.monthlyActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.monthlyActivity.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        {item.month}
                      </span>
                      <div className="text-sm text-gray-500">
                        {item.events} events • {item.participants} participants
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                            style={{
                              width: `${Math.max(
                                (item.events /
                                  Math.max(
                                    ...analytics.monthlyActivity.map(
                                      (a) => a.events
                                    )
                                  )) *
                                  100,
                                5
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.max(
                                (item.participants /
                                  Math.max(
                                    ...analytics.monthlyActivity.map(
                                      (a) => a.participants
                                    )
                                  )) *
                                  100,
                                5
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No monthly activity data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <PieChart className="w-6 h-6 mr-2 text-purple-500" />
              Top Sport Categories
            </h3>
          </div>
          {analytics.topCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-400 to-gray-500"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-400 to-orange-500"
                          : "bg-gradient-to-r from-purple-400 to-purple-500"
                      }`}
                    >
                      <span className="text-white font-bold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {category.count}
                    </div>
                    <div className="text-sm text-gray-500">events</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            This Week's Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {analytics.recentStats.newUsersThisWeek}
              </div>
              <div className="text-blue-100 text-lg">New Users</div>
              <div className="text-blue-200 text-sm mt-1">Last 7 days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {analytics.recentStats.newEventsThisWeek}
              </div>
              <div className="text-blue-100 text-lg">New Events</div>
              <div className="text-blue-200 text-sm mt-1">Last 7 days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {analytics.recentStats.participationsThisWeek}
              </div>
              <div className="text-blue-100 text-lg">New Participations</div>
              <div className="text-blue-200 text-sm mt-1">Last 7 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
