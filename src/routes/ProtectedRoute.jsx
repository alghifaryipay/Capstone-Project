import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function ProtectedRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useAuth();

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">
          Loading...
        </h1>

      </div>
    );
  }

  if (!user) {

    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
}

export default ProtectedRoute;