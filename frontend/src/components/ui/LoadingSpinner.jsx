const LoadingSpinner = ({
  title = "Loading",
  subtitle = "Please wait...",
  size = "large",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Main spinner */}
          <div
            className={`${sizeClasses[size]} border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto`}
          ></div>

          {/* Secondary spinner */}
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-blue-500 rounded-full animate-spin mx-auto`}
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-600 text-lg">{subtitle}</p>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
