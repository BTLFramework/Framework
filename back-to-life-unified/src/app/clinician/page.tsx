'use client';

import React, { useState } from 'react';
import { MultiStepForm } from '../../components/MultiStepForm';

export default function ClinicianDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clinician Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage patient assessments and SRS scoring</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <MultiStepForm />
        </div>
      </div>
    </div>
  );
}
