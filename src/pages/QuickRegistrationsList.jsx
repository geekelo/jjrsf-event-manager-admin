"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchEventQuickRegistrations } from "../redux/quickRegistrationsSlice"
import { sendDirectEmail } from "../redux/notificationsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faUserPlus,
  faSearch,
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faVenus,
  faMars,
  faLock,
  faFilter,
  faChevronDown,
  faCheck,
  faShieldAlt,
  faPaperPlane,
  faSpinner,
  faGlobe,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"
import Pagination from "../components/Pagination"
import DirectEmailModal from "../components/notifications/DirectEmailModal"
import "../stylesheets/attendeeList.css"
import "../stylesheets/QuickRegistrations.css"

const QuickRegistrationsList = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get event data from Redux store
  const { events } = useSelector((state) => state.events)

  // Get quick registrations from Redux store
  const { quickRegistrations, loading, error } = useSelector((state) => state.quickRegistrations)
  const { loading: emailLoading } = useSelector((state) => state.notifications)

  // Local state
  const [filteredRegistrations, setFilteredRegistrations] = useState([])
  const [displayedRegistrations, setDisplayedRegistrations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [eventName, setEventName] = useState("Event Name")
  const [filterActive, setFilterActive] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  // Filters state
  const [filters, setFilters] = useState({
    gender: "all",
    dateRange: "all",
    attendance: "all",
    verification: "all",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

  // Load event name and quick registrations data when component mounts
  useEffect(() => {
    // Find event name from events array
    const currentEvent = events.find((event) => event.id === eventId)
    if (currentEvent) {
      setEventName(currentEvent.name)
    }

    // ✅ Fetch quick registrations from API
    if (eventId) {
      const res = dispatch(fetchEventQuickRegistrations(eventId))
    }
  }, [eventId, events, dispatch])

  // Helper function to match gender values
  const matchGender = (regGender, filterGender) => {
    if (!regGender) return false

    // Convert to lowercase for case-insensitive comparison
    const regGenderLower = regGender.toLowerCase()
    const filterGenderLower = filterGender.toLowerCase()

    // Check for exact match first
    if (regGenderLower === filterGenderLower) return true

    // Check for abbreviated forms
    if (filterGenderLower === "m" && (regGenderLower === "male" || regGenderLower === "m")) return true
    if (filterGenderLower === "f" && (regGenderLower === "female" || regGenderLower === "f")) return true
    if (filterGenderLower === "male" && (regGenderLower === "m" || regGenderLower === "male")) return true
    if (filterGenderLower === "female" && (regGenderLower === "f" || filterGenderLower === "female")) return true

    return false
  }

  // Apply filters and search to the quick registrations data
  useEffect(() => {
    if (quickRegistrations.length) {
      const filtered = quickRegistrations.filter((reg) => {
        // Text search filter
        const searchMatch =
          searchTerm === "" ||
          (reg.name && reg.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.email && reg.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.phone && reg.phone.toLowerCase().includes(searchTerm.toLowerCase()))

        // Gender filter
        const genderMatch = filters.gender === "all" || matchGender(reg.gender, filters.gender)

        // Date range filter
        let dateMatch = true
        const regDate = new Date(reg.registrationDate || reg.created_at) // Use created_at if registrationDate is not available
        const today = new Date()

        if (filters.dateRange === "today") {
          const todayStart = new Date(today.setHours(0, 0, 0, 0))
          dateMatch = regDate >= todayStart
        } else if (filters.dateRange === "yesterday") {
          const yesterdayStart = new Date(today)
          yesterdayStart.setDate(yesterdayStart.getDate() - 1)
          yesterdayStart.setHours(0, 0, 0, 0)

          const yesterdayEnd = new Date(today)
          yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)
          yesterdayEnd.setHours(23, 59, 59, 999)

          dateMatch = regDate >= yesterdayStart && regDate <= yesterdayEnd
        } else if (filters.dateRange === "last7days") {
          const last7Days = new Date(today)
          last7Days.setDate(last7Days.getDate() - 7)
          dateMatch = regDate >= last7Days
        } else if (filters.dateRange === "last30days") {
          const last30Days = new Date(today)
          last30Days.setDate(last30Days.getDate() - 30)
          dateMatch = regDate >= last30Days
        }

        // Attendance filter
        const attendedOnline = reg.attendedOnline || reg.attended_online || false
        const attendedOffline = reg.attendedOffline || reg.attended_offline || false

        let attendanceMatch = true
        if (filters.attendance === "online") {
          attendanceMatch = attendedOnline && !attendedOffline
        } else if (filters.attendance === "offline") {
          attendanceMatch = attendedOffline && !attendedOnline
        } else if (filters.attendance === "both") {
          attendanceMatch = attendedOnline && attendedOffline
        } else if (filters.attendance === "none") {
          attendanceMatch = !attendedOnline && !attendedOffline
        }

        // Verification filter
        const verificationMatch =
          filters.verification === "all" ||
          (filters.verification === "verified" && reg.verified) ||
          (filters.verification === "unverified" && !reg.verified)

        return searchMatch && genderMatch && dateMatch && attendanceMatch && verificationMatch
      })

      setFilteredRegistrations(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1) // Reset to first page when filters change
    } else {
      setFilteredRegistrations([])
      setTotalPages(0)
    }
  }, [quickRegistrations, searchTerm, filters, itemsPerPage])

  // Update displayed registrations when page changes or filtered results change
  useEffect(() => {
    if (filteredRegistrations.length) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, filteredRegistrations.length)
      setDisplayedRegistrations(filteredRegistrations.slice(startIndex, endIndex))
    } else {
      setDisplayedRegistrations([])
    }
  }, [currentPage, filteredRegistrations, itemsPerPage])

  const handleBack = () => {
    navigate(`/events/${eventId}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the list
    document.querySelector(".quick-reg-content")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
  }

  const toggleFilter = () => {
    setFilterActive(!filterActive)
  }

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      gender: "all",
      dateRange: "all",
      attendance: "all",
      verification: "all",
    })
  }

  const handleOpenEmailModal = (registration) => {
    setSelectedRegistration(registration)
    setShowEmailModal(true)
  }

  const handleSendEmail = (emailData) => {
    // Pass the complete payload directly to the action
    dispatch(sendDirectEmail(emailData))
      .unwrap()
      .then(() => {
        setShowEmailModal(false)
      })
  }

  // Helper function to get display gender
  const getDisplayGender = (gender) => {
    if (!gender) return "N/A"

    const genderLower = gender.toLowerCase()
    if (genderLower === "m" || genderLower === "male") return "Male"
    if (genderLower === "f" || genderLower === "female") return "Female"
    return gender // Return as is if not recognized
  }

  // Helper function to get gender icon
  const getGenderIcon = (gender) => {
    if (!gender) return faVenus

    const genderLower = gender.toLowerCase()
    if (genderLower === "m" || genderLower === "male") return faMars
    return faVenus
  }

  if (loading) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading quick registrations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <p>Error loading quick registrations: {error}</p>
          <button className="primary-button" onClick={handleBack}>
            Back to Event
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="attendee-list-page">
      <div className="attendee-list-container">
        <div className="attendee-list-header">
          <button className="back-button" onClick={handleBack} aria-label="Back to event">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faUserPlus} /> Quick Registrations
              <span className="attendee-count">{filteredRegistrations.length}</span>
            </h1>
            <p className="event-name">{eventName}</p>
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-button" onClick={() => setSearchTerm("")} aria-label="Clear search">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          <button className={`filter-button ${filterActive ? "active" : ""}`} onClick={toggleFilter}>
            <FontAwesomeIcon icon={faFilter} />
            <span>Filter</span>
            {(filters.gender !== "all" ||
              filters.dateRange !== "all" ||
              filters.attendance !== "all" ||
              filters.verification !== "all") && <span className="filter-badge"></span>}
          </button>
        </div>

        {filterActive && (
          <div className="filter-panel">
            <div className="filter-panel-content">
              <div className="filter-group">
                <label>Gender</label>
                <div className="select-wrapper">
                  <select value={filters.gender} onChange={(e) => handleFilterChange("gender", e.target.value)}>
                    <option value="all">All</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                </div>
              </div>

              <div className="filter-group">
                <label>Registration Date</label>
                <div className="select-wrapper">
                  <select value={filters.dateRange} onChange={(e) => handleFilterChange("dateRange", e.target.value)}>
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                </div>
              </div>

              <div className="filter-group">
                <label>Attendance</label>
                <div className="select-wrapper">
                  <select value={filters.attendance} onChange={(e) => handleFilterChange("attendance", e.target.value)}>
                    <option value="all">All</option>
                    <option value="online">Online Only</option>
                    <option value="offline">Onsite Only</option>
                    <option value="both">Both Online & Onsite</option>
                    <option value="none">No Attendance</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                </div>
              </div>

              <div className="filter-group">
                <label>Verification</label>
                <div className="select-wrapper">
                  <select
                    value={filters.verification}
                    onChange={(e) => handleFilterChange("verification", e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters-button" onClick={clearFilters}>
                <FontAwesomeIcon icon={faTimes} />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div className="quick-reg-content">
          {filteredRegistrations.length > 0 ? (
            <>
              <div className="quick-reg-grid">
                {displayedRegistrations.map((registration) => {
                  // Get preferred attendance value
                  const preferredAttendance =
                    registration.preferredAttendance || registration.preferred_attendance || "N/A"
                  // Get attendance status
                  const attendedOnline = registration.attendedOnline || registration.attended_online || false
                  const attendedOffline = registration.attendedOffline || registration.attended_offline || false

                  return (
                    <div key={registration.id} className="quick-reg-card">
                      <div className="quick-reg-header">
                        <h3 className="quick-reg-name">
                          <FontAwesomeIcon icon={faUser} className="icon-primary" />
                          {registration.name}
                        </h3>
                      </div>

                      <div className="quick-reg-details">
                        {/* Address Section */}
                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>Address:</span>
                          </div>
                          <div className="quick-reg-value">{registration.address || "N/A"}</div>
                        </div>

                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>Email:</span>
                          </div>
                          <div className="quick-reg-value">{registration.email || "N/A"}</div>
                        </div>

                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Phone:</span>
                          </div>
                          <div className="quick-reg-value">{registration.phone || "N/A"}</div>
                        </div>

                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={getGenderIcon(registration.gender)} />
                            <span>Gender:</span>
                          </div>
                          <div className="quick-reg-value">{getDisplayGender(registration.gender)}</div>
                        </div>

                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faGlobe} />
                            <span>Preferred:</span>
                          </div>
                          <div className="quick-reg-value">{preferredAttendance}</div>
                        </div>

                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faLock} />
                            <span>OTP:</span>
                          </div>
                          <div className="quick-reg-value otp-value">{registration.otp || "N/A"}</div>
                        </div>

                        {/* Attendance status */}
                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faCheck} />
                            <span>Attendance:</span>
                          </div>
                          <div className="quick-reg-value">
                            <div className="attendance-badges">
                              <div className={`attendance-badge ${attendedOnline ? "attended" : "not-attended"}`}>
                                {attendedOnline ? (
                                  <>
                                    <FontAwesomeIcon icon={faCheck} />
                                    <span>Online</span>
                                  </>
                                ) : (
                                  <span>Online</span>
                                )}
                              </div>
                              <div className={`attendance-badge ${attendedOffline ? "attended" : "not-attended"}`}>
                                {attendedOffline ? (
                                  <>
                                    <FontAwesomeIcon icon={faCheck} />
                                    <span>Onsite</span>
                                  </>
                                ) : (
                                  <span>Onsite</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verification status */}
                        <div className="quick-reg-item">
                          <div className="quick-reg-label">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <span>Status:</span>
                          </div>
                          <div className="quick-reg-value">
                            <span className={`verification-badge ${registration.verified ? "verified" : "unverified"}`}>
                              {registration.verified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        </div>

                        {/* Email Button */}
                        <div className="quick-reg-actions">
                          <button
                            className="email-button"
                            onClick={() => handleOpenEmailModal(registration)}
                            disabled={emailLoading}
                          >
                            {emailLoading ? (
                              <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                              <FontAwesomeIcon icon={faPaperPlane} />
                            )}
                            <span>Send Email</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredRegistrations.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          ) : (
            <div className="no-results">
              <FontAwesomeIcon icon={faUserPlus} size="3x" style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p>
                No quick registrations found
                {searchTerm ||
                filters.gender !== "all" ||
                filters.dateRange !== "all" ||
                filters.attendance !== "all" ||
                filters.verification !== "all"
                  ? " matching your search criteria"
                  : ""}
                .
              </p>
              {(searchTerm ||
                filters.gender !== "all" ||
                filters.dateRange !== "all" ||
                filters.attendance !== "all" ||
                filters.verification !== "all") && (
                <button
                  className="clear-filters-button"
                  onClick={() => {
                    setSearchTerm("")
                    clearFilters()
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedRegistration && (
        <DirectEmailModal
          eventId={eventId}
          attendeeId={selectedRegistration.id}
          attendeeName={selectedRegistration.name}
          onClose={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          isLoading={emailLoading}
        />
      )}
    </div>
  )
}

export default QuickRegistrationsList
