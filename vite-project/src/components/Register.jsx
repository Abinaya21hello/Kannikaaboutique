import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaSpinner
} from 'react-icons/fa'
import { FaCrown } from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')
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
    if (Object.keys(touched).length > 0) {
      validateField()
    }
  }, [formData, touched])

  const validateField = () => {
    const newErrors = {}
    
    if (touched.name) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }
    }
    
    if (touched.email) {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
    }
    
    if (touched.phone) {
      if (!formData.phone) {
        newErrors.phone = 'Phone is required'
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Enter valid 10-digit number'
      }
    }
    
    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    }
    
    if (touched.confirmPassword) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    if (touched.agreeTerms && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
      
      if (name === 'password') {
        let strength = 0
        if (value.length >= 6) strength++
        if (/[a-z]/.test(value)) strength++
        if (/[A-Z]/.test(value)) strength++
        if (/[0-9]/.test(value)) strength++
        if (/[^A-Za-z0-9]/.test(value)) strength++
        setPasswordStrength(strength)
      }
      
      return newData
    })
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setApiError('')
    setApiSuccess('')
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true
    })
    
    const isValid = validateField()
    if (!isValid) return
    
    setIsLoading(true)
    setApiError('')
    setApiSuccess('')
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })
      
      setApiSuccess('Registration successful! Redirecting...')
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setApiError('Email already exists')
        } else {
          setApiError(error.response.data.message || 'Registration failed')
        }
      } else {
        setApiError('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return { text: 'Weak', color: '#ff4444', width: '20%' }
      case 1: return { text: 'Weak', color: '#ff7744', width: '40%' }
      case 2: return { text: 'Fair', color: '#ffaa44', width: '60%' }
      case 3: return { text: 'Good', color: '#44aa44', width: '80%' }
      case 4: return { text: 'Strong', color: '#2E7D32', width: '90%' }
      case 5: return { text: 'Strong', color: '#1B5E20', width: '100%' }
      default: return { text: '', color: '', width: '0%' }
    }
  }

  return (
    <div className="register-page">
      {/* Background Decoration */}
      <div className="register-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
        <FaLeaf className="bg-leaf leaf-1" />
        <FaLeaf className="bg-leaf leaf-2" />
        <FaLeaf className="bg-leaf leaf-3" />
      </div>

      <div className="register-container" data-aos="zoom-in">
        <div className="form-wrapper">
          {/* Brand */}
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

          {/* Messages */}
          {apiSuccess && (
            <div className="api-success-message">
              <span>✓</span> {apiSuccess}
            </div>
          )}
          {apiError && (
            <div className="api-error-message">
              <span>✕</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Name */}
            <div className="form-group">
              <label>
                <FaUser className="field-icon" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={errors.name && touched.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && touched.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>
                <FaEnvelope className="field-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={errors.email && touched.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && touched.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>
                <FaPhone className="field-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                maxLength="10"
                className={errors.phone && touched.phone ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.phone && touched.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>
                <FaLock className="field-icon" />
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={errors.password && touched.password ? 'error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: getStrengthText().width,
                        backgroundColor: getStrengthText().color
                      }}
                    />
                  </div>
                  <span style={{ color: getStrengthText().color }}>
                    {getStrengthText().text}
                  </span>
                </div>
              )}
              
              {errors.password && touched.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>
                <FaLock className="field-icon" />
                Confirm Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Address (Optional) */}
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="field-icon" />
                Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Terms */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={() => handleBlur('agreeTerms')}
                  disabled={isLoading}
                />
                <span>
                  I agree to the <Link to="/terms">Terms</Link> & <Link to="/privacy">Privacy</Link>
                </span>
              </label>
              {errors.agreeTerms && touched.agreeTerms && (
                <span className="error-message">{errors.agreeTerms}</span>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="register-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register