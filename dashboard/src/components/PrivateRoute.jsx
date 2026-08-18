import { Navigate } from "react-router-dom";
import { getPractitionerToken, isPractitionerTokenValid } from "../api/authenticatedFetch";

function PrivateRoute({ children }) {
  const token = getPractitionerToken();
  return isPractitionerTokenValid(token) ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
