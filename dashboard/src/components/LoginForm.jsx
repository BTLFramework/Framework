import React, { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { bootstrapPractitioner, getPractitionerSetupStatus } from "../api/auth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupError, setSetupError] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const loginMutation = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getPractitionerSetupStatus()
      .then(({ data }) => active && setSetupRequired(Boolean(data?.setupRequired)))
      .catch(() => active && setSetupError("Unable to verify practitioner account status. Please refresh and try again."))
      .finally(() => active && setCheckingSetup(false));
    return () => { active = false; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (setupRequired) {
      setSetupError("");
      if (password !== confirmPassword) {
        setSetupError("Passwords do not match.");
        return;
      }
      setCreatingAccount(true);
      bootstrapPractitioner({ email, password })
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        })
        .catch((error) => setSetupError(error.response?.data?.error || "Account setup failed"))
        .finally(() => setCreatingAccount(false));
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {setupRequired && (
        <div className="rounded-xl border border-btl-300 bg-btl-50 px-4 py-3 text-sm text-charcoal-700">
          <span className="font-semibold">First-time practitioner setup:</span> create the only clinician account for this portal. This form permanently disables after completion.
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-2">
          Email Address
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm transition-all duration-200"
          type="email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-2">
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          type="password"
          className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm transition-all duration-200"
          required
        />
      </div>
      {setupRequired && (
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            type="password"
            className="w-full px-4 py-3 border border-btl-300 rounded-xl focus-ring bg-white shadow-sm transition-all duration-200"
            required
          />
          <p className="mt-2 text-xs text-charcoal-600">
            Use at least 10 characters with uppercase, lowercase, a number, and a symbol.
          </p>
        </div>
      )}
      <button
        type="submit"
        disabled={checkingSetup || creatingAccount || loginMutation.isPending}
        className="w-full btn-primary-gradient text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkingSetup
          ? "Checking account..."
          : creatingAccount
            ? "Creating Secure Account..."
            : setupRequired
              ? "Create Practitioner Account"
              : loginMutation.isPending
                ? "Signing In..."
                : "Sign In"}
      </button>
      {loginMutation.isSuccess && (
        <div className="text-btl-600 text-center font-medium">Login successful!</div>
      )}
      {loginMutation.isError && (
        <div className="text-red-600 text-center font-medium">
          {loginMutation.error.response?.data || "Login failed"}
        </div>
      )}
      {setupError && (
        <div className="text-red-600 text-center font-medium">{setupError}</div>
      )}
    </form>
  );
}

export default LoginForm;
