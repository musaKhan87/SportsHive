import Navbar from "./components/layout/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/routing/PrivateRoute";
import Dashboard from "./pages/user/Dashboard";
import Events from "./pages/user/Events";
import CreateEvent from "./pages/user/CreateEvent";
import EditEvent from "./pages/user/EditEvent";
import EventDetails from "./pages/user/EventDetails";
import MyEvents from "./pages/user/MyEvents";
import Guide from "./pages/user/Guide";
import Profile from "./pages/user/Profile";

import AdminRoute from "./components/routing/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageCategories from "./pages/admin/ManageCategories";
import ContactMessages from "./pages/admin/ContactMessages";
import Analytics from "./pages/admin/Analytics";
import ManageAreas from "./pages/admin/ManageAreas";
import ManageCities from "./pages/admin/ManageCities";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/events"
                element={
                  <PrivateRoute>
                    <Events />
                  </PrivateRoute>
                }
              />

              <Route
                path="/events/:id"
                element={
                  <PrivateRoute>
                    <EventDetails />
                  </PrivateRoute>
                }
              />

              <Route
                path="/create-event"
                element={
                  <PrivateRoute>
                    <CreateEvent />
                  </PrivateRoute>
                }
              />

              <Route
                path="/edit-event/:id"
                element={
                  <PrivateRoute>
                    <EditEvent />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-events"
                element={
                  <PrivateRoute>
                    <MyEvents />
                  </PrivateRoute>
                }
              />
              <Route
                path="/guide"
                element={
                  <PrivateRoute>
                    <Guide />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-users"
                element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <AdminRoute>
                    <ManageEvents />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-events"
                element={
                  <AdminRoute>
                    <ManageEvents />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <ManageCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-categories"
                element={
                  <AdminRoute>
                    <ManageCategories />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/contacts"
                element={
                  <AdminRoute>
                    <ContactMessages />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/contact-messages"
                element={
                  <AdminRoute>
                    <ContactMessages />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/manage-area"
                element={
                  <AdminRoute>
                    <ManageAreas />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-city"
                element={
                  <AdminRoute>
                    <ManageCities />
                  </AdminRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
