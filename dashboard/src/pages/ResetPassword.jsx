import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PractitionerAuthLayout from "../components/PractitionerAuthLayout";
import { resetPractitionerPassword } from "../api/auth";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPractitionerPassword(token, password);
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to reset the password right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PractitionerAuthLayout title="Choose a new password" subtitle="Clinician Portal" showBackToLogin={!complete}>
      {complete ? (
        <div className="text-center space-y-5">
          <p className="text-btl-800 font-medium">Your password has been updated.</p>
          <Link to="/login" className="inline-block w-full btn-primary-gradient text-white py-3 rounded-xl font-semibold">Continue to sign in</Link>
        </div>
      ) : token ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-charcoal-600">Use at least 10 characters with uppercase, lowercase, a number, and a symbol.</p>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-charcoal-700 mb-2">New Password</label>
            <input id="new-password" name="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm" required minLength={10} />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-charcoal-700 mb-2">Confirm New Password</label>
            <input id="confirm-new-password" name="confirm-new-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm" required minLength={10} />
          </div>
          <button type="submit" disabled={submitting} className="w-full btn-primary-gradient text-white py-3 rounded-xl font-semibold disabled:opacity-50">{submitting ? "Updating…" : "Update password"}</button>
          {error && <div className="text-red-600 text-center text-sm" role="alert">{error}</div>}
        </form>
      ) : (
        <div className="text-center text-red-600" role="alert">This reset link is missing its secure token. Please request a new one.</div>
      )}
    </PractitionerAuthLayout>
  );
}

export default ResetPassword;

