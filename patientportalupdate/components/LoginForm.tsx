"use client"

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        // Redirect to dashboard after successful login
        window.location.href = '/'
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError('Login failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Back to Life</h1>
          <p className="text-btl-600">Patient Recovery Portal</p>
        </div>

        {/* Login Card */}
        <div className="card-gradient rounded-xl shadow-lg p-8 border border-btl-200">
          <h2 className="text-2xl font-semibold text-btl-900 mb-6 text-center">Welcome Back</h2>
          
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
                  className="w-full pl-10 pr-4 py-3 border border-btl-200 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-transparent bg-white text-btl-900 placeholder-btl-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-btl-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-btl-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-btl-200 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-transparent bg-white text-btl-900 placeholder-btl-400"
                  placeholder="Enter your password"
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-gradient text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-btl-50 rounded-lg border border-btl-200">
            <h3 className="text-sm font-medium text-btl-700 mb-2">Need Help?</h3>
            <div className="text-xs text-btl-600 space-y-1">
              <p>If you haven't created an account yet, please complete your assessment first.</p>
              <p>Contact us at <a href="mailto:support@backtolife.ca" className="text-btl-500 hover:underline">support@backtolife.ca</a> for assistance.</p>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-btl-600">
              New patient?{' '}
              <a href="/create-account" className="text-btl-500 hover:text-btl-700 font-medium hover:underline">
                Create your account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 