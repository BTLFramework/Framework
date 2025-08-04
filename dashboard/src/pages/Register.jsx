import React from "react";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-btl-50 to-white">
      <div className="w-full max-w-md card-gradient rounded-xl shadow-xl p-8 border border-btl-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 back-to-life-gradient rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 back-to-life-gradient rounded-sm"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Back to Life
          </h2>
          <p className="text-charcoal-600">Create Clinician Account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
