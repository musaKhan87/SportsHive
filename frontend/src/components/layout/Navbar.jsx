import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Database,
  BookOpen,
  Home,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEventsMenu, setShowEventsMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [mobileActiveSection, setMobileActiveSection] = useState("main"); // 'main', 'admin', 'events'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
  };

  const resetMobileMenu = () => {
    setIsOpen(false);
    setMobileActiveSection("main");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                SportsHive
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                  >
                    <Home size={16} className="mr-2 text-green-500" />
                    Dashboard
                  </Link>
                )}

                {/* Events Dropdown */}
                <div className="relative ">
                  <button
                    onClick={() => setShowEventsMenu(!showEventsMenu)}
                    className="flex items-center text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                  >
                    <Calendar size={16} className="mr-2 text-green-500" />
                    Events
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {showEventsMenu && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border">
                      <Link
                        to="/events"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setShowEventsMenu(false)}
                      >
                        <Calendar size={16} className="mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">Browse Events</div>
                          <div className="text-xs text-gray-500">
                            Find sports events near you
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/my-events"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setShowEventsMenu(false)}
                      >
                        <Users size={16} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">My Events</div>
                          <div className="text-xs text-gray-500">
                            Events you've joined
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/create-event"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        onClick={() => setShowEventsMenu(false)}
                      >
                        <div className="w-4 h-4 mr-3 text-purple-500 flex items-center justify-center">
                          <span className="text-lg font-bold">+</span>
                        </div>
                        <div>
                          <div className="font-medium">Create Event</div>
                          <div className="text-xs text-gray-500">
                            Organize your own event
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {!isAdmin && (
                  <Link
                    to="/guide"
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <BookOpen size={16} className="mr-2 text-blue-500" />
                    Guide
                  </Link>
                )}

                {!isAdmin && (
                  <Link
                    to="/contact"
                    className="flex items-center text-gray-700 hover:text-purple-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50"
                  >
                    <MessageSquare size={16} className="mr-2 text-purple-500" />
                    Contact
                  </Link>
                )}

                {/* Admin Dropdown */}

                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAdminMenu(!showAdminMenu)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
                    >
                      <Shield size={16} className="mr-2 text-blue-500" />
                      Admin
                      <ChevronDown size={16} className="ml-1" />
                    </button>

                    {showAdminMenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border">
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <BarChart3 size={16} className="mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Dashboard</div>
                            <div className="text-xs text-gray-500">
                              Admin overview & stats
                            </div>
                          </div>
                        </Link>
                        <div className="border-t my-1"></div>
                        <Link
                          to="/admin/manage-users"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <Users size={16} className="mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Manage Users</div>
                            <div className="text-xs text-gray-500">
                              User accounts & permissions
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/admin/manage-events"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <Calendar size={16} className="mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Manage Events</div>
                            <div className="text-xs text-gray-500">
                              Event moderation & control
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/admin/manage-categories"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <Database size={16} className="mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Categories</div>
                            <div className="text-xs text-gray-500">
                              Sports categories & settings
                            </div>
                          </div>
                        </Link>
                        <div className="border-t my-1"></div>
                        <Link
                          to="/admin/contact-messages"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <MessageSquare
                            size={16}
                            className="mr-3 text-blue-500"
                          />
                          <div>
                            <div className="font-medium">Messages</div>
                            <div className="text-xs text-gray-500">
                              User contact messages
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/admin/analytics"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <BarChart3 size={16} className="mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Analytics</div>
                            <div className="text-xs text-gray-500">
                              Platform insights & metrics
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-green-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border">
                      <div className="px-4 py-3 border-b bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">Profile Settings</div>
                          <div className="text-xs text-gray-500">
                            Manage your account
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/my-events"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar size={16} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">My Events</div>
                          <div className="text-xs text-gray-500">
                            View your events
                          </div>
                        </div>
                      </Link>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={16} className="mr-3 text-red-500" />
                        <div className="text-left">
                          <div className="font-medium">Logout</div>
                          <div className="text-xs text-gray-500">
                            Sign out of your account
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/about"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-blue-50 "
                >
                  <Users size={16} className="mr-2 text-blue-500 " />
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  className="flex items-center text-gray-700 hover:text-purple-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50 "
                >
                  <MessageSquare size={16} className="mr-2 text-purple-500" />
                  Contact
                </NavLink>
                <NavLink
                  to="/login"
                  className="flex items-center text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50 "
                >
                  <LogIn size={16} className="mr-2 text-green-500 " />
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="to-gray-700 hover:to-gray-600 transition-colors   "
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-white ">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 ">
            {user ? (
              <>
                {/* User Info Header */}
                <div className="px-3 py-4 border-b border-gray-200 mb-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mx-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {isAdmin && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Administrator
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Navigation */}
                {mobileActiveSection === "main" && (
                  <>
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 px-3 mb-4">
                      <Link
                        to="/dashboard"
                        className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Home size={20} className="text-green-500 mb-1" />
                        <span className="text-sm font-medium text-gray-700">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        to="/create-event"
                        className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <div className="w-5 h-5 text-purple-500 mb-1 flex items-center justify-center">
                          <span className="text-xl font-bold">+</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Create Event
                        </span>
                      </Link>
                    </div>

                    {/* Menu Sections */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setMobileActiveSection("events")}
                        className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-3 text-green-500" />
                          <span className="font-medium">Events</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => setMobileActiveSection("admin")}
                          className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center">
                            <Shield size={18} className="mr-3 text-blue-500" />
                            <span className="font-medium">Admin Panel</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </button>
                      )}

                      {!isAdmin && (
                        <>
                          <Link
                            to="/guide"
                            className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={resetMobileMenu}
                          >
                            <BookOpen
                              size={18}
                              className="mr-3 text-blue-500"
                            />
                            <span className="font-medium">Guide</span>
                          </Link>

                          <Link
                            to="/contact"
                            className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={resetMobileMenu}
                          >
                            <MessageSquare
                              size={18}
                              className="mr-3 text-purple-500"
                            />
                            <span className="font-medium">Contact</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Settings size={18} className="mr-3 text-green-500" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={18} className="mr-3" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Events Submenu */}
                {mobileActiveSection === "events" && (
                  <>
                    <div className="flex items-center px-3 py-2 border-b border-gray-200 mb-3">
                      <button
                        onClick={() => setMobileActiveSection("main")}
                        className="mr-3 p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight
                          size={16}
                          className="text-gray-400 transform rotate-180"
                        />
                      </button>
                      <Calendar size={18} className="mr-2 text-green-500" />
                      <span className="font-medium text-gray-900">Events</span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/events"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Calendar size={18} className="mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">Browse Events</div>
                          <div className="text-xs text-gray-500">
                            Find sports events near you
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/my-events"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Users size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">My Events</div>
                          <div className="text-xs text-gray-500">
                            Events you've joined
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/create-event"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <div className="w-5 h-5 mr-3 text-purple-500 flex items-center justify-center">
                          <span className="text-lg font-bold">+</span>
                        </div>
                        <div>
                          <div className="font-medium">Create Event</div>
                          <div className="text-xs text-gray-500">
                            Organize your own event
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}

                {/* Admin Submenu */}
                {mobileActiveSection === "admin" && isAdmin && (
                  <>
                    <div className="flex items-center px-3 py-2 border-b border-gray-200 mb-3">
                      <button
                        onClick={() => setMobileActiveSection("main")}
                        className="mr-3 p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight
                          size={16}
                          className="text-gray-400 transform rotate-180"
                        />
                      </button>
                      <Shield size={18} className="mr-2 text-blue-500" />
                      <span className="font-medium text-gray-900">
                        Admin Panel
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/admin"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <BarChart3 size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Dashboard</div>
                          <div className="text-xs text-gray-500">
                            Admin overview & stats
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/manage-users"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Users size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Manage Users</div>
                          <div className="text-xs text-gray-500">
                            User accounts & permissions
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/manage-events"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Calendar size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Manage Events</div>
                          <div className="text-xs text-gray-500">
                            Event moderation & control
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/manage-categories"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <Database size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Categories</div>
                          <div className="text-xs text-gray-500">
                            Sports categories & settings
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/contact-messages"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <MessageSquare
                          size={18}
                          className="mr-3 text-blue-500"
                        />
                        <div>
                          <div className="font-medium">Messages</div>
                          <div className="text-xs text-gray-500">
                            User contact messages
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/analytics"
                        className="flex items-center px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={resetMobileMenu}
                      >
                        <BarChart3 size={18} className="mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Analytics</div>
                          <div className="text-xs text-gray-500">
                            Platform insights & metrics
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <NavLink
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users size={18} className="mr-3 text-blue-500" />
                  <span className="font-medium">About</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageSquare size={18} className="mr-3 text-purple-500" />
                  <span className="font-medium">Contact</span>
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <LogIn size={18} className="mr-3 text-green-500" />
                  <span className="font-medium">Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <UserPlus size={18} className="mr-3 text-blue-500" />
                  <span className="font-medium">Sing Up</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
