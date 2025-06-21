import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import Spinner from "../ui/Spinner";


const AdminRoute = ({children}) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" />
        </div>
     )
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }
    return children;
}

export default AdminRoute
