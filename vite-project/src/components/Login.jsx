import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaLeaf,
  FaSpinner
} from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { FaCrown } from 'react-icons/fa'
import axios from 'axios'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
  }, [])

  // Real-time validation
  useEffect(() => {
    if (touched.email || touched.password) {
      validateField()
    }
  }, [formData, touched])

  const validateField = () => {
    const newErrors = {}
    
    // Email validation
    if (touched.email) {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      } else if (formData.email.length > 50) {
        newErrors.email = 'Email must be less than 50 characters'
      }
    }
    
    // Password validation
    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      } else if (formData.password.length > 20) {
        newErrors.password = 'Password must be less than 20 characters'
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter'
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter'
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setApiError('') // Clear API error when user types
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    })
    
    // Validate all fields
    const isValid = validateField()
    if (!isValid) {
      return
    }
    
    setIsLoading(true)
    setApiError('')
    
    try {
      const response = await axios.post('http://localhorst:5000/api/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Login response:', response.data)
      
      // Store token if returned
      if (response.data.token) {
        if (formData.rememberMe) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } else {
          sessionStorage.setItem('token', response.data.token)
          sessionStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      // Show success message
      alert('Login successful!')
      
      // Redirect to home page
      navigate('/')
      
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 400:
            setApiError(error.response.data.message || 'Invalid request. Please check your input.')
            break
          case 401:
            setApiError('Invalid email or password. Please try again.')
            break
          case 403:
            setApiError('Account locked. Please contact support.')
            break
          case 404:
            setApiError('User not found. Please check your email.')
            break
          case 429:
            setApiError('Too many login attempts. Please try again later.')
            break
          case 500:
            setApiError('Server error. Please try again later.')
            break
          default:
            setApiError('Login failed. Please try again.')
        }
      } else if (error.request) {
        // Request made but no response
        setApiError('Network error. Please check your internet connection.')
      } else {
        // Something else happened
        setApiError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!formData.password) return 0
    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[A-Z]/.test(formData.password)) strength++
    if (/[a-z]/.test(formData.password)) strength++
    if (/[0-9]/.test(formData.password)) strength++
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++
    return strength
  }

  const getStrengthText = () => {
    const strength = getPasswordStrength()
    switch(strength) {
      case 0: return { text: 'Very Weak', color: '#ff4444', width: '20%' }
      case 1: return { text: 'Weak', color: '#ff7744', width: '40%' }
      case 2: return { text: 'Fair', color: '#ffaa44', width: '60%' }
      case 3: return { text: 'Good', color: '#44ff44', width: '80%' }
      case 4: return { text: 'Strong', color: '#44aa44', width: '90%' }
      case 5: return { text: 'Very Strong', color: '#006400', width: '100%' }
      default: return { text: '', color: '', width: '0%' }
    }
  }

  return (
    <div className="login-page">
      {/* Background Decoration */}
      <div className="login-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
        <FaLeaf className="bg-leaf leaf-1" />
        <FaLeaf className="bg-leaf leaf-2" />
        <FaLeaf className="bg-leaf leaf-3" />
      </div>

      {/* Centered Form */}
      <div className="login-container" data-aos="zoom-in">
        <div className="form-wrapper">
          {/* Brand with Crown */}
          <div className="form-brand">
            <h1 className="brand-name">
              <span className="k-with-crown">
                <FaCrown className="crown-icon" />
                <span className="k-letter">K</span>
              </span>
              <span className="brand-name-text">annikaa Boutique</span>
            </h1>
            <p className="brand-tagline">Crafting elegance since 2009</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="api-error-message">
              <span className="error-icon">❌</span>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="field-icon" />
                Email Address
              </label>
              <div className={`input-wrapper ${errors.email && touched.email ? 'error' : ''} ${formData.email && !errors.email ? 'success' : ''}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={errors.email && touched.email ? 'error' : ''}
                  disabled={isLoading}
                />
                {formData.email && !errors.email && touched.email && (
                  <span className="input-success">✓</span>
                )}
              </div>
              {errors.email && touched.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="field-icon" />
                Password
              </label>
              <div className={`input-wrapper ${errors.password && touched.password ? 'error' : ''} ${formData.password && !errors.password ? 'success' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setShowPasswordStrength(true)}
                  className={errors.password && touched.password ? 'error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {formData.password && !errors.password && touched.password && (
                  <span className="input-success">✓</span>
                )}
              </div>
              
              {/* Password Strength Indicator */}
              {showPasswordStrength && formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: getStrengthText().width,
                        backgroundColor: getStrengthText().color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: getStrengthText().color }}>
                    {getStrengthText().text}
                  </span>
                </div>
              )}
              
              {errors.password && touched.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Form Options */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            {/* Register Link */}
            <div className="register-link">
              Don't have an account?{' '}
              <Link to="/register" className="create-account-link">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login