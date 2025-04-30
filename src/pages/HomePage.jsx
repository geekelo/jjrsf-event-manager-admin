"use client"

import { useEffect, useState} from "react"
import { useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchEvents } from "../redux/eventsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircle,
  faEye,
  faEyeSlash,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"
import "../stylesheets/homePage.css"
import jjrsfLogo from "../assets/jjrsf-logo.png"
import { createAxiosInstance } from "../config/axios"
import { setToken, setUser } from "../lib/auth/token"
import { toast } from "react-toastify"


const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const [speakerCount, setSpeakerCount] = useState(0)
  
  // Login form state
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(fetchEvents())

    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 80) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [dispatch])

  // Replace with this new useEffect that only handles scrolling and count-up animation
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 80) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const eventTarget = 15
    const attendeeTarget = 500
    const speakerTarget = 10

    const eventDuration = 2000 // 2 seconds
    const attendeeDuration = 2500 // 2.5 seconds
    const speakerDuration = 1500 // 1.5 seconds

    const eventIncrement = eventTarget / (eventDuration / 50)
    const attendeeIncrement = attendeeTarget / (attendeeDuration / 50)
    const speakerIncrement = speakerTarget / (speakerDuration / 50)

    let eventTimer, attendeeTimer, speakerTimer

    if (eventCount < eventTarget) {
      eventTimer = setTimeout(() => {
        setEventCount((prev) => {
          const newValue = prev + eventIncrement
          return newValue >= eventTarget ? eventTarget : newValue
        })
      }, 50)
    }

    if (attendeeCount < attendeeTarget) {
      attendeeTimer = setTimeout(() => {
        setAttendeeCount((prev) => {
          const newValue = prev + attendeeIncrement
          return newValue >= attendeeTarget ? attendeeTarget : newValue
        })
      }, 50)
    }

    if (speakerCount < speakerTarget) {
      speakerTimer = setTimeout(() => {
        setSpeakerCount((prev) => {
          const newValue = prev + speakerIncrement
          return newValue >= speakerTarget ? speakerTarget : newValue
        })
      }, 50)
    }

    return () => {
      clearTimeout(eventTimer)
      clearTimeout(attendeeTimer)
      clearTimeout(speakerTimer)
    }
  }, [eventCount, attendeeCount, speakerCount])

  // Login form handlers
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    // Clear error for field
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const axiosInstance = createAxiosInstance()

      const payload = {
        user: {
          email: formData.email,
          password: formData.password,
        },
      }

      const response = await axiosInstance.post("/api/v1/login", payload)
      const { token, user } = response.data

      setToken(token)
      setUser(user)

      toast.success("Login successful! Redirecting...")
      setTimeout(() => {
        navigate("/events")
      }, 1500)
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  // Generate random shape positions
  const generateShapes = (count) => {
    const shapes = []
    for (let i = 0; i < count; i++) {
      shapes.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 80,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 30,
      })
    }
    return shapes
  }

  const heroShapes = generateShapes(10)

  return (
    <div className="premium-home-page">
      {/* Hero Section */}
      <section className="premium-hero-section" id="home">
        {/* Decorative shapes */}
        {heroShapes.map((shape, index) => (
          <div
            key={index}
            className="hero-shape"
            style={{
              top: shape.top,
              left: shape.left,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
            }}
          ></div>
        ))}

        <div className="premium-hero-glass">
          <div className="premium-hero-content">
            <div className="premium-hero-text">
              <span className="hero-kicker">Welcome to</span>
              <h1>
                <span className="accent-text">JJRS</span> Foundation
                <br />
                Program Portal
              </h1>
              <p className="premium-hero-description">
                Create and Manage programs seamlessly and effectively
              </p>
            </div>
            <div className="premium-hero-login">
              <div className="hero-login-form-container">
                <h2 className="hero-login-title">Admin Login</h2>
                <form className="hero-login-form" onSubmit={handleSubmit}>
                  <div className="hero-form-group">
                    <label htmlFor="email" className="hero-form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="hero-form-input"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="hero-form-error">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="hero-form-group">
                    <label htmlFor="password" className="hero-form-label">
                      Password
                    </label>
                    <div className="hero-password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="hero-form-input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="hero-password-toggle-btn"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && (
                      <div className="hero-form-error">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  <div className="hero-form-options">
                    <label className="hero-form-remember" htmlFor="remember">
                      <input
                        type="checkbox"
                        className="hero-form-checkbox"
                        id="remember"
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="hero-form-forgot">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="hero-form-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="hero-spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="premium-about-section" id="about">
        <div className="premium-container">
          <div className="premium-about-wrapper">
            <div className="premium-about-image">
              <div className="about-image-container">
                <div className="about-image-background"></div>
                <div className="about-image-pattern"></div>
                <div className="about-image-shape"></div>
              </div>
            </div>
            <div className="premium-about-content">
              <div className="premium-section-header left-aligned">
                <span className="section-kicker">Our Story</span>
                <h2>About JJRS Foundation</h2>
              </div>
              <div className="section-decorator left-aligned">
                <span></span>
                <FontAwesomeIcon icon={faCircle} className="decorator-icon" />
                <span></span>
              </div>
              <div className="premium-about-text">
                <p>
                  JJRS Foundation is dedicated to fostering transformative experiences that inspire growth and create
                  meaningful connections within our community.
                </p>
                <p>
                  Since our inception, we've been committed to developing leaders who are adaptive in bringing positive
                  change and influential in advancing our shared vision for a better future.
                </p>

                <div className="premium-values">
                  <div className="premium-value-item">
                    <div className="value-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47" />
                      </svg>
                    </div>
                    <div className="value-content">
                      <h4>Our Mission</h4>
                      <p>
                        To create impactful events that foster community growth, learning, and connection while
                        providing valuable resources for personal development.
                      </p>
                    </div>
                  </div>

                  <div className="premium-value-item">
                    <div className="value-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"
                        />
                      </svg>
                    </div>
                    <div className="value-content">
                      <h4>Our Vision</h4>
                      <p>
                        To be the leading provider of transformative events that inspire change and create lasting
                        impact in our communities and beyond.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
   
      {/* Footer */}
      <footer className="premium-footer" id="contact">
        <div className="footer-top-pattern"></div>
        <div className="premium-container">          
          <div className="premium-footer-bottom">
            <p>&copy; {new Date().getFullYear()} JJRS Foundation. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
