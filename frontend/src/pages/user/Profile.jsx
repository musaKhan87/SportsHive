import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../api/api";
import { User, Mail, MapPin, X, Camera, Save, AlertCircle } from "lucide-react";
import Spinner from "../../components/ui/Spinner";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    favoriteCategories: [],
    avatar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data);

        // Set user data if available
        if (user) {
          setFormData({
            name: user.name || "",
            bio: user.bio || "",
            location: user.location || "",
            favoriteCategories:
              user.favoriteCategories?.map((cat) => cat._id || cat) || [],
            avatar: user.avatar || null, // so it still exists in formData
          });

          // If user.avatar is a full URL from Cloudinary, use it as-is
          if (user.avatar) {
            setPreviewImage(user.avatar);
          }
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
        setSubmitError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevData) => {
      if (isChecked) {
        return {
          ...prevData,
          favoriteCategories: [...prevData.favoriteCategories, categoryId],
        };
      } else {
        return {
          ...prevData,
          favoriteCategories: prevData.favoriteCategories.filter(
            (id) => id !== categoryId
          ),
        };
      }
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
    }
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: null });
    setPreviewImage(null); // Clear preview, fallback can show initials or default avatar
  };
  
  

  const validateForm = () => {
    const errors = {};
    const { name } = formData;

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();

      // Append all form fields to FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);
      formDataToSend.append(
        "favoriteCategories",
        JSON.stringify(formData.favoriteCategories)
      );

      // Append avatar if selected
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const result = await updateProfile(formDataToSend);

      if (result.success) {
        setSuccessMessage("Profile updated successfully");
         setTimeout(() => setSuccessMessage(""), 3000); // hide after 3 seconds
        
      } else {
        setSubmitError(result.error || "Failed to update profile");
        setTimeout(() => setSuccessMessage(""), 3000); // hide after 3 seconds
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                        {previewImage ? (
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User size={64} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600"
                      >
                        <Camera size={16} />
                        <input
                          type="file"
                          id="avatar"
                          name="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="mt-2 text-sm text-red-500 flex items-center hover:text-red-700"
                      >
                        <X size={16} className="mr-1" /> Remove Photo
                      </button>
                    )}
                    <p className="mt-4 text-sm text-gray-500 text-center">
                      Upload a profile photo to personalize your account
                    </p>
                  </div>
                </div>

                {/* Profile Info Section */}
                <div className="md:w-2/3">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            formErrors.name
                              ? "border-red-300"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself, your sports interests, and skill level..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorite Categories Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Favorite Sports Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        value={category._id}
                        checked={formData.favoriteCategories.includes(
                          category._id
                        )}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category._id}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Spinner size="small" className="mr-2" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile
