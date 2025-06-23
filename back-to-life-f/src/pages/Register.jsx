import React from "react";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
