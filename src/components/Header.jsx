"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import jjrsfLogo from "../assets/jjrsf-logo.png"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
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
            <li className={location.pathname === "/" ? "active" : ""}>
              <a href="/">Home</a>
            </li>
            <li
              className={
                location.pathname.includes("/events") && !location.pathname.includes("/attendees") ? "active" : ""
              }
            >
              <a href="/events">Events</a>
            </li>
            <li className={location.pathname === "/attendees" ? "active" : ""}>
              <a href="/attendees">Attendees</a>
            </li>
            <li className="">
              {sessionStorage.getItem("admin_token") ? (
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    sessionStorage.removeItem("admin_token")
                    sessionStorage.removeItem("admin_user")
                    toast.success("Logged out successfully")
                    navigate("/")
                  }}
                >
                  Logout
                </a>
              ) : (
                <a href="/admin/login">Login</a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
