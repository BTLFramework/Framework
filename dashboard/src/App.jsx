import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import SignatureRecoveryScore from "./pages/SignatureRecoveryScore";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/messages"
            element={<PrivateRoute><Messages /></PrivateRoute>}
          />
          <Route
            path="/signature-recovery-score"
            element={<PrivateRoute><SignatureRecoveryScore /></PrivateRoute>}
          />
          <Route path="*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
