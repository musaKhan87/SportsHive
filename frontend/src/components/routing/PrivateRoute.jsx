import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import Spinner from "../ui/Spinner";

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="large"/>
          </div>
        )
    }

    return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
