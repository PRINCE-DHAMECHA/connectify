import { useAppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user?.displayName) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
