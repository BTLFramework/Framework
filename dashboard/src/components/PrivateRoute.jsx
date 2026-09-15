import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getPractitionerSession } from "../api/auth";

function PrivateRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    getPractitionerSession()
      .then(() => active && setStatus("authenticated"))
      .catch(() => active && setStatus("anonymous"));
    return () => { active = false; };
  }, []);

  if (status === "checking") {
    return <div className="min-h-screen flex items-center justify-center text-charcoal-600">Checking secure session…</div>;
  }
  return status === "authenticated" ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
