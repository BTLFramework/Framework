import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
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
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/messages"
            element={<Messages />}
          />
          <Route
            path="/signature-recovery-score"
            element={<SignatureRecoveryScore />}
          />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
