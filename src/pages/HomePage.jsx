"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch} from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { fetchEvents } from "../redux/eventsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarDays,
  faLocationDot,
  faCalendarCheck,
  faChevronRight,
  faStar,
  faCircle,
 // Added this icon for website
} from "@fortawesome/free-solid-svg-icons"
import "../stylesheets/homePage.css"
import jjrsfLogo from "../assets/jjrsf-logo.png"

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isNavOpen, setIsNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const featuredEventRef = useRef(null)

  // Add these new states and functions for the count-up animation
  const [eventCount, setEventCount] = useState(0)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const [speakerCount, setSpeakerCount] = useState(0)

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

  // Remove the events filtering logic
  // Replace with static sample event data
  const sampleEvent = {
    id: 1,
    name: "Annual Leadership Conference",
    description:
      "Join us for our flagship event focused on developing leadership skills and networking with industry professionals. This conference features keynote speakers, workshops, and networking opportunities.",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    location: "Main Conference Center, Downtown",
    status: "ongoing",
  }



  const featuredEvent = sampleEvent

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`)
  }

 

 

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
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
      {/* Header/Navigation */}
      <header className={`premium-header ${scrolled ? "scrolled" : ""}`}>
        <div className="premium-header-container">
          <div className="premium-logo-container">
            <img src={jjrsfLogo || "/placeholder.svg"} alt="JJRSF Logo" className="premium-logo" />
            <div className="premium-logo-text">
              <h1>JJRSF</h1>
              <span className="premium-logo-tagline">Program Portal</span>
            </div>
          </div>
          <button className="premium-mobile-menu-button" onClick={toggleNav} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`premium-nav ${isNavOpen ? "open" : ""}`}>
            <ul>
              <li className="active">
                <a href="#home">Home</a>
              </li>
              <li>
                <Link to="/admin/login" className="premium-login-btn">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

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
                <span className="accent-text">JJRSF</span> Foundation
                <br />
                Program Portal
              </h1>
              <p className="premium-hero-description">
              Create and Manage programs seamlessly and effectively

              </p>
            
            </div>
            <div className="premium-hero-image">
              <div className="rotating-circles">
                <div className="circle circle1"></div>
                <div className="circle circle2"></div>
                <div className="circle circle3"></div>
              </div>
              <div className="hero-stats">
              <li>
                <Link to="/admin/login" className="stat-item">
                  Login
                </Link>
              </li>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="premium-featured-section" ref={featuredEventRef} id="featured">
          <div className="premium-container">
            <div className="premium-section-intro">
              <div className="premium-section-header">
                <span className="section-kicker">Don't Miss Out</span>
                <h2>Featured Event</h2>
              </div>
              <div className="section-decorator">
                <span></span>
                <FontAwesomeIcon icon={faStar} className="decorator-icon" />
                <span></span>
              </div>
            </div>

            <div className="premium-featured-event">
              <div className="premium-featured-event-image">
                <div className="event-image-placeholder">
                  <FontAwesomeIcon icon={faCalendarCheck} className="placeholder-icon" />
                </div>
                <div className="event-date-badge">
                  <span className="date-day">{new Date(featuredEvent.start_date).getDate()}</span>
                  <span className="date-month">
                    {new Date(featuredEvent.start_date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
              </div>
              <div className="premium-featured-event-content">
                <div className="event-status-badge">
                  <span className={`status-indicator ${featuredEvent.status}`}></span>
                  {featuredEvent.status}
                </div>
                <h3>{featuredEvent.name}</h3>
                <div className="premium-event-meta">
                  <div className="meta-item">
                    <div className="meta-icon">
                      <FontAwesomeIcon icon={faCalendarDays} />
                    </div>
                    <span>
                      {featuredEvent.start_date === featuredEvent.end_date
                        ? formatDate(featuredEvent.start_date)
                        : `${formatDate(featuredEvent.start_date)} - ${formatDate(featuredEvent.end_date)}`}
                    </span>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">
                      <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    <span>{featuredEvent.location}</span>
                  </div>
                </div>
                <p className="premium-event-description">{featuredEvent.description}</p>
                <button className="premium-event-button" onClick={() => handleViewEvent(featuredEvent.id)}>
                  View Event <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

     
     
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
                <h2>About JJRSF Foundation</h2>
              </div>
              <div className="section-decorator left-aligned">
                <span></span>
                <FontAwesomeIcon icon={faCircle} className="decorator-icon" />
                <span></span>
              </div>
              <div className="premium-about-text">
                <p>
                  JJRSF Foundation is dedicated to fostering transformative experiences that inspire growth and create
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
            <p>&copy; {new Date().getFullYear()} JJRSF Foundation. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
