import { useEffect, useState } from "react";
import { fecthAllEvents, getUserCreatedEvent } from "../../api/api";
import { Link } from "react-router-dom";

import {
  Calendar,
  Users,
  Plus,
  TrendingUp,
  Award,
  Clock,
  Star,
  Activity,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/ui/EventCard";
import Spinner from "../../components/ui/Spinner";
const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
      upcomingEvents: [],
      myEvents: [],
      joinedEvents: [],
      stats: {
        eventsJoined: 0,
        eventsCreated: 0,
        buddiesConnected: 0,
        totalHours: 0,
      },
      recommendations: [],
      recentActivity: [],
    });
    const [loading, setLoading] = useState(true);
  console.log(user);
  
    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          // Fetch all events for upcoming events section
          const eventsRes = await fecthAllEvents();
          const allEvents = eventsRes.data.events || eventsRes.data || [];
  
          // Filter upcoming events (future events with available spots)
          const upcomingEvents = allEvents
            .filter((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const hasSpots =
                !event.maxParticipants ||
                (event.participants?.length || 0) < event.maxParticipants;
              return eventDate > today && hasSpots && event.status === "active";
            })
            .slice(0, 4);
  
          // Fetch user's events if authenticated
          let myEvents = [];
          let joinedEvents = [];
          let recentActivity = [];
  
          if (user) {
            try {
              // Get user's created events
              const myEventsRes = await getUserCreatedEvent();
              myEvents = myEventsRes.data || [];
  
              // Get events user has joined
              joinedEvents = allEvents.filter((event) =>
                event.participants?.some(
                  (participant) =>
                    participant._id === user._id || participant === user._id
                )
              );
  
              // Create real recent activity based on user's events
              recentActivity = [];
  
              // Add recent events user joined
              const recentJoined = joinedEvents
                .filter(
                  (event) =>
                    new Date(event.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )
                .slice(0, 2);
  
              recentJoined.forEach((event) => {
                recentActivity.push({
                  description: `Joined "${event.title}"`,
                  time: new Date(event.createdAt).toLocaleDateString(),
                });
              });
  
              // Add recent events user created
              const recentCreated = myEvents
                .filter(
                  (event) =>
                    new Date(event.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )
                .slice(0, 2);
  
              recentCreated.forEach((event) => {
                recentActivity.push({
                  description: `Created "${event.title}"`,
                  time: new Date(event.createdAt).toLocaleDateString(),
                });
              });
  
              // Sort by most recent
              recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
              recentActivity = recentActivity.slice(0, 5);
            } catch (error) {
              console.log("Error fetching user events:", error);
            }
          }
  
          // Calculate real stats
          const stats = {
            eventsJoined: joinedEvents.length,
            eventsCreated: myEvents.length,
            buddiesConnected: joinedEvents.reduce(
              (total, event) => total + (event.participants?.length || 0),
              0
            ),
            totalHours: joinedEvents.length * 2, // Assume 2 hours per event
          };
  
          setDashboardData({
            upcomingEvents,
            myEvents,
            joinedEvents,
            stats,
            recommendations: upcomingEvents.slice(0, 2),
            recentActivity,
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          // Set empty data on error
          setDashboardData({
            upcomingEvents: [],
            myEvents: [],
            joinedEvents: [],
            stats: {
              eventsJoined: 0,
              eventsCreated: 0,
              buddiesConnected: 0,
              totalHours: 0,
            },
            recommendations: [],
            recentActivity: [],
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardData();
    }, [user]);
  
    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && value > 0 && (
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />+{trend}%
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
    );
  
    const ActivityItem = ({ activity }) => (
      <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{activity.description}</p>
          <p className="text-gray-500 text-sm">{activity.time}</p>
        </div>
      </div>
    );
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" />
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
  
              <div className="relative">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back{user ? `, ${user.name}` : ""}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  Ready for your next sports adventure? Here's what's happening in
                  your community.
                </p>
  
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/events"
                    className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Browse Events
                  </Link>
                  {user && (
                    <Link
                      to="/create-event"
                      className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Event
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Stats Grid */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Calendar}
                title="Events Joined"
                value={dashboardData.stats.eventsJoined}
                subtitle="Total joined"
                color="from-blue-500 to-cyan-500"
                trend={dashboardData.stats.eventsJoined > 0 ? 12 : null}
              />
              <StatCard
                icon={Plus}
                title="Events Created"
                value={dashboardData.stats.eventsCreated}
                subtitle="Total organized"
                color="from-green-500 to-emerald-500"
                trend={dashboardData.stats.eventsCreated > 0 ? 8 : null}
              />
              <StatCard
                icon={Users}
                title="Connections Made"
                value={dashboardData.stats.buddiesConnected}
                subtitle="Through events"
                color="from-purple-500 to-pink-500"
                trend={dashboardData.stats.buddiesConnected > 0 ? 25 : null}
              />
              <StatCard
                icon={Clock}
                title="Active Hours"
                value={`${dashboardData.stats.totalHours}h`}
                subtitle="Estimated total"
                color="from-yellow-500 to-orange-500"
                trend={dashboardData.stats.totalHours > 0 ? 15 : null}
              />
            </div>
          )}
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Upcoming Events
                    </h2>
                  </div>
                  <Link
                    to="/events"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
  
                {dashboardData.upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dashboardData.upcomingEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">
                      No upcoming events available
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
  
              {/* Recommended Events */}
              {user && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Recommended for You
                    </h2>
                  </div>
  
                  {dashboardData.recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dashboardData.recommendations.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        No recommendations available yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
  
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {user && (
                    <Link
                      to="/create-event"
                      className="flex items-center w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Create Event
                    </Link>
                  )}
                  <Link
                    to="/events"
                    className="flex items-center w-full p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    Browse Events
                  </Link>
                  {user && (
                    <Link
                      to="/profile"
                      className="flex items-center w-full p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Update Profile
                    </Link>
                  )}
                </div>
              </div>
  
              {/* Recent Activity */}
              {user && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Activity
                    </h3>
                  </div>
  
                  {dashboardData.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentActivity.map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              )}
  
              {/* Achievement Badge */}
              {user && dashboardData.stats.eventsJoined > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
                  </div>
                  <p className="text-white/90 mb-4">
                    You've joined {dashboardData.stats.eventsJoined} events. Keep
                    up the great work!
                  </p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Active Athlete Badge</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Dashboard
