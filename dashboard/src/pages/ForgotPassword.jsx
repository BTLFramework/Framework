import React, { useState } from "react";
import PractitionerAuthLayout from "../components/PractitionerAuthLayout";
import { requestPractitionerPasswordReset } from "../api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const { data } = await requestPractitionerPasswordReset(email);
      setMessage(data?.message || "If that clinician account exists, a reset link has been emailed.");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "We could not request a reset right now. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PractitionerAuthLayout title="Reset password" subtitle="Clinician Portal">
      <p className="text-sm text-charcoal-600 mb-5">
        Enter the clinician email address. We’ll send a secure link that expires in 30 minutes.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-charcoal-700 mb-2">Email Address</label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm"
            required
          />
        </div>
        <button type="submit" disabled={submitting} className="w-full btn-primary-gradient text-white py-3 rounded-xl font-semibold disabled:opacity-50">
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
      {message && <div className="mt-5 text-center text-sm text-charcoal-700" role="status" aria-live="polite">{message}</div>}
      {error && <div className="mt-5 text-center text-sm text-red-700" role="alert">{error}</div>}
    </PractitionerAuthLayout>
  );
}

export default ForgotPassword;
