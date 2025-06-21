import axios from "axios";

// ✅ Axios instance
const app = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically on every request
app.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ API Calls

export const getCurrentUser = () => {
  return app.get(`/auth/me`);
};

export const registerUser = (name, email, password) => {
  return app.post(`/auth/register`, { name, email, password });
};

export const loginUser = (email, password) => {
  return app.post(`/auth/login`, { email, password });
};

export const submitContact = (formData) => {
  return app.post(`/contacts`, formData);
};

export const getAllEvents = () => {
  return app.get(`/events/featured`).catch(() => ({ data: [] }));
};

export const getStats = () => {
  return app.get(`/stats`).catch(() => ({
    data: { users: 0, events: 0, categories: 0 },
  }));
};

export const fecthAllEvents = () => {
  return app.get(`/events`);
};

export const getUserCreatedEvent = () => {
  return app.get(`/events/user`);
};

export const getUserJoinedEvent = () => {
  return app.get(`/events/joined`);
};

export const getCategories = () => {
  return app.get(`/categories`);
};

export const getCities = () => {
  return app.get(`/cities`);
};

export const getAreas = () => {
  return app.get(`/areas`);
};

export const updateUserProfile = (formData) => {
  return app.put(`/users/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createEvent = (formDataToSend) => {
  return app.post(`/events`, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSingleEvents = (id) => {
  return app.get(`/events/${id}`);
};

export const getJoinEvent = (id) => {
  return app.post(`/events/${id}/join`);
};

export const leaveEvent = (id) => {
  return app.post(`/events/${id}/leave`);
};

export const deleteEvent = (id) => {
  return app.delete(`/events/${id}`);
};

export const getEvent = () => {
  return app.get(`/events`);
};

export const updateEvent = (id, formDataToSend) => {
  return app.put(`/events/${id}`, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAdmin = () => {
  return app.get(`/admin/users`).catch(() => ({ data: [] }));
};

export const getAdminContact = () => {
  return app.get(`/contacts/admin`).catch(() => ({
    data: { contacts: [] },
  }));
};

export const getUsers = () => {
  return app.get(`/admin/users`);
};

export const changeUserRole = (userId, newRole) => {
  return app.put(`/admin/users/${userId}/role`, { role: newRole });
};

export const deleteUser = (userToDelete) => {
  return app.delete(`/admin/users/${userToDelete._id}`);
};

export const getUserData = () => {
  return app.get(`/users`);
};

export const getAdminReadContact = (id) => {
  return app.put(`/contacts/admin/${id}/read`);
};

export const deleteContact = (id) => {
  return app.delete(`/contacts/admin/${id}`);
};

export const createCategories = (formData) => {
  return app.post(`/categories`, formData);
}


export const updateCategories = (selectedCategory,formData) => {
  return app.put(
    `/categories/${selectedCategory._id}`,
    formData
  );
};

export const deleteCategories = (selectedCategory) => {
  return app.delete(`/categories/${selectedCategory._id}`);
};

export const createArea= (formData) => {
  return app.post(`/areas`, formData);
}


export const updateArea = (id,formData) => {
  return app.put(
    `/areas/${id}`,
    formData
  );
};

export const deleteArea = (id) => {
  return app.delete(`/areas/${id}`);
};

export const createCity = (formData) => {
  return app.post(`/cities`, formData);
};

export const updateCity = (id, formData) => {
  return app.put(`/cities/${id}`, formData);
};

export const deleteCity = (id) => {
  return app.delete(`/cities/${id}`);
};