import React from "react";
import { Link } from "react-router-dom";

function PractitionerAuthLayout({ title, subtitle, children, showBackToLogin = true }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-btl-50 to-white px-4">
      <div className="w-full max-w-md card-gradient rounded-xl shadow-xl p-8 border border-btl-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 back-to-life-gradient rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 back-to-life-gradient rounded-sm" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{title}</h1>
          <p className="text-charcoal-600">{subtitle}</p>
        </div>
        {children}
        {showBackToLogin && (
          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="font-medium text-btl-700 hover:text-btl-900 underline underline-offset-2">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default PractitionerAuthLayout;

