"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react'

interface CreateAccountFormProps {
  patientEmail: string
  patientName: string
  onSuccess: () => void
  onBack: () => void
}

export function CreateAccountForm({ patientEmail, patientName, onSuccess, onBack }: CreateAccountFormProps) {
  const [email, setEmail] = useState(patientEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    matches: password === confirmPassword && password.length > 0
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements and matches confirmation.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/patient-portal/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password,
          patientName 
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create account. Please try again.')
      }
    } catch (err) {
      setError('Account creation failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card-gradient rounded-xl shadow-lg p-8 border border-btl-200 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-btl-900 mb-2">Account Created!</h2>
              <p className="text-btl-600">Your patient portal account has been successfully created.</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">Your Login Credentials:</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> ••••••••</p>
              </div>
            </div>

            <p className="text-btl-600 text-sm mb-6">
              You can now access your personalized recovery portal with these credentials.
            </p>

            <div className="animate-pulse">
              <p className="text-btl-500 text-sm">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Back to Life</h1>
          <p className="text-btl-600">Create Your Patient Portal Account</p>
        </div>

        {/* Create Account Card */}
        <div className="card-gradient rounded-xl shadow-lg p-8 border border-btl-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-btl-900 mb-2 text-center">Welcome, {patientName}!</h2>
            <p className="text-btl-600 text-center text-sm">
              Your assessment is complete. Now let's create your secure portal account.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-btl-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-btl-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-btl-200 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-transparent bg-white text-btl-900"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-btl-700 mb-2">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-btl-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-btl-200 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-transparent bg-white text-btl-900"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-btl-400 hover:text-btl-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-btl-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-btl-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-btl-200 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-transparent bg-white text-btl-900"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-btl-400 hover:text-btl-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-btl-50 border border-btl-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-btl-700 mb-3">Password Requirements:</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center ${passwordRequirements.minLength ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasUppercase ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasLowercase ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  One number
                </div>
                <div className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasSpecialChar ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  One special character
                </div>
                <div className={`flex items-center ${passwordRequirements.matches ? 'text-green-600' : 'text-btl-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.matches ? 'bg-green-500' : 'bg-btl-300'}`}></div>
                  Passwords match
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes('Portal account already exists') && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-red-600 text-sm mb-3">
                      Your account already exists. You can login with your existing credentials.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.href = '/'}
                      className="w-full bg-btl-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-btl-700 transition-all duration-200"
                    >
                      Go to Login
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full btn-primary-gradient text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-full text-btl-600 font-medium py-2 px-4 rounded-lg hover:bg-btl-50 transition-all duration-200"
            >
              ← Back to Assessment Results
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 