import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <button
        type="submit"
        disabled={loginMutation.isLoading}
        className="w-full btn-primary-gradient text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loginMutation.isLoading ? "Signing In..." : "Sign In"}
      </button>
      {loginMutation.isSuccess && (
        <div className="text-btl-600 text-center font-medium">Login successful!</div>
      )}
      {loginMutation.isError && (
        <div className="text-red-600 text-center font-medium">
          {loginMutation.error.response?.data || "Login failed"}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
