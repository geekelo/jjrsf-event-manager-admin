"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
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
} from "@fortawesome/free-solid-svg-icons"
import Pagination from "../components/Pagination"
import "../stylesheets/attendeeList.css"
import "../stylesheets/QuickRegistrations.css"

// Make sure the generateDummyQuickRegistrations function includes registration dates
const generateDummyQuickRegistrations = (count) => {
  const genders = ["Male", "Female"]
  const registrations = []

  for (let i = 1; i <= count; i++) {
    const gender = genders[Math.floor(Math.random() * genders.length)]

    // Generate a random date within the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30)
    const registrationDate = new Date()
    registrationDate.setDate(registrationDate.getDate() - randomDaysAgo)

    registrations.push({
      id: i,
      name: `Quick User ${i}`,
      email: `quick${i}@example.com`,
      phone: `+1 555-${String(i).padStart(3, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      otp: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit OTP
      registrationDate: registrationDate.toISOString(),
    })
  }

  return registrations
}

const QuickRegistrationsList = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  // Get event data from Redux store
  const { events } = useSelector((state) => state.events)

  // Local state
  const [quickRegistrations, setQuickRegistrations] = useState([])
  const [filteredRegistrations, setFilteredRegistrations] = useState([])
  const [displayedRegistrations, setDisplayedRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [eventName, setEventName] = useState("Event Name")
  const [filterActive, setFilterActive] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    gender: "all",
    dateRange: "all",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

  // Load dummy data and event name when component mounts
  useEffect(() => {
    // Find event name from events array
    const currentEvent = events.find((event) => event.id === eventId)
    if (currentEvent) {
      setEventName(currentEvent.name)
    }

    // Generate dummy data (between 25-50 registrations)
    const dummyCount = Math.floor(25 + Math.random() * 25)
    const dummyData = generateDummyQuickRegistrations(dummyCount)
    setQuickRegistrations(dummyData)
    setLoading(false)
  }, [eventId, events])

  // Filter registrations based on search term and filters
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
        const genderMatch = filters.gender === "all" || reg.gender === filters.gender

        // Date range filter
        let dateMatch = true
        const regDate = new Date(reg.registrationDate)
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

        return searchMatch && genderMatch && dateMatch
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
    })
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
            {(filters.gender !== "all" || filters.dateRange !== "all") && <span className="filter-badge"></span>}
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
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
                {displayedRegistrations.map((registration) => (
                  <div key={registration.id} className="quick-reg-card">
                    <div className="quick-reg-header">
                      <h3 className="quick-reg-name">
                        <FontAwesomeIcon icon={faUser} className="icon-primary" />
                        {registration.name}
                      </h3>
                    </div>

                    <div className="quick-reg-details">
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
                          <FontAwesomeIcon icon={registration.gender === "Male" ? faMars : faVenus} />
                          <span>Gender:</span>
                        </div>
                        <div className="quick-reg-value">{registration.gender || "N/A"}</div>
                      </div>

                      <div className="quick-reg-item">
                        <div className="quick-reg-label">
                          <FontAwesomeIcon icon={faLock} />
                          <span>OTP:</span>
                        </div>
                        <div className="quick-reg-value otp-value">{registration.otp || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                {searchTerm || filters.gender !== "all" || filters.dateRange !== "all"
                  ? " matching your search criteria"
                  : ""}
                .
              </p>
              {(searchTerm || filters.gender !== "all" || filters.dateRange !== "all") && (
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
    </div>
  )
}

export default QuickRegistrationsList
