"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faUsers } from "@fortawesome/free-solid-svg-icons"
import AttendeeCard from "../components/AttendeeCard"
import SearchAndFilterBar from "../components/SearchAndFilterBar"
import Pagination from "../components/Pagination"
import "../stylesheets/attendeeList.css"

const AttendeeList = () => {
  const { eventId, type } = useParams()
  const navigate = useNavigate()
  const [attendees, setAttendees] = useState([])
  const [filteredAttendees, setFilteredAttendees] = useState([])
  const [displayedAttendees, setDisplayedAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState(false)
  const [eventName, setEventName] = useState("Event Name")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Filters state
  const [filters, setFilters] = useState({
    gender: "all",
    memberStatus: "all",
    preferredAttendance: "all",
    attendance: "all",
  })

  useEffect(() => {
    // Simpler fetch for testing
    setTimeout(() => {
      setEventName("Annual Conference 2023")
      const generatedAttendees = generateDummyAttendees(45) // Generate more attendees to test pagination
      setAttendees(generatedAttendees)
      setFilteredAttendees(generatedAttendees)
      setTotalPages(Math.ceil(generatedAttendees.length / itemsPerPage))
      setLoading(false)
    }, 500)
  }, [])

  // Filter attendees whenever search or filters change
  useEffect(() => {
    if (attendees.length) {
      const filtered = attendees.filter((attendee) => {
        // Search filter
        const searchMatch =
          searchTerm === "" ||
          `${attendee.title} ${attendee.firstName} ${attendee.middleName || ""} ${attendee.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (attendee.email && attendee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (attendee.phone && attendee.phone.toLowerCase().includes(searchTerm.toLowerCase()))

        // Gender filter
        const genderMatch = filters.gender === "all" || attendee.gender === filters.gender

        // Member status filter
        const memberMatch =
          filters.memberStatus === "all" ||
          (filters.memberStatus === "yes" && attendee.isMember) ||
          (filters.memberStatus === "no" && !attendee.isMember)

        // Preferred attendance filter
        const preferredMatch =
          filters.preferredAttendance === "all" || attendee.preferredAttendance === filters.preferredAttendance

        // Actual attendance filter
        let attendanceMatch = true
        if (filters.attendance === "online") {
          attendanceMatch = attendee.attendedOnline && !attendee.attendedOffline
        } else if (filters.attendance === "offline") {
          attendanceMatch = attendee.attendedOffline && !attendee.attendedOnline
        } else if (filters.attendance === "both") {
          attendanceMatch = attendee.attendedOnline && attendee.attendedOffline
        } else if (filters.attendance === "none") {
          attendanceMatch = !attendee.attendedOnline && !attendee.attendedOffline
        }

        return searchMatch && genderMatch && memberMatch && preferredMatch && attendanceMatch
      })

      setFilteredAttendees(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1) // Reset to first page when filters change
    }
  }, [searchTerm, filters, attendees])

  // Update displayed attendees when page changes or filtered results change
  useEffect(() => {
    if (filteredAttendees.length) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, filteredAttendees.length)
      setDisplayedAttendees(filteredAttendees.slice(startIndex, endIndex))
    } else {
      setDisplayedAttendees([])
    }
  }, [currentPage, filteredAttendees, itemsPerPage])

  // Update total pages when items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredAttendees.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when items per page changes
  }, [itemsPerPage, filteredAttendees.length])

  const handleBack = () => {
    navigate(`/events/${eventId}`)
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
      memberStatus: "all",
      preferredAttendance: "all",
      attendance: "all",
    })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the attendee list
    document.querySelector(".attendee-content")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
  }

  // Get the type label for the header
  const getTypeLabel = () => {
    switch (type) {
      case "registered":
        return "All Registered"
      case "online":
        return "Attended Online"
      case "offline":
        return "Attended Onsite"
      case "both":
        return "Attended Both"
      case "absent":
        return "Did Not Attend"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading attendees...</p>
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
              <FontAwesomeIcon icon={faUsers} /> Attendees
              <span className="attendee-count">{filteredAttendees.length}</span>
            </h1>
            <p className="event-name">
              {eventName} {getTypeLabel() && `- ${getTypeLabel()}`}
            </p>
          </div>
        </div>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActive={filterActive}
          toggleFilter={toggleFilter}
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />

        <div className="attendee-content">
          {filteredAttendees.length > 0 ? (
            <>
              <div className="attendee-cards-grid">
                {displayedAttendees.map((attendee) => (
                  <AttendeeCard key={attendee.id} attendee={attendee} />
                ))}
              </div>

              {filteredAttendees.length > itemsPerPage && (
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
              <p>No attendees found matching your search criteria.</p>
              {(searchTerm || Object.values(filters).some((value) => value !== "all")) && (
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

// Helper function to generate dummy attendees
function generateDummyAttendees(count) {
  const titles = ["Mr.", "Mrs.", "Ms.", "Dr."]
  const genders = ["Male", "Female"]
  const preferredOptions = ["Online", "Offline"]

  const attendees = []

  for (let i = 1; i <= count; i++) {
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const firstName = `First${i}`
    const middleName = Math.random() > 0.3 ? `Middle${i}` : ""
    const lastName = `Last${i}`
    const isMember = Math.random() > 0.5
    const preferredAttendance = preferredOptions[Math.floor(Math.random() * preferredOptions.length)]
    const attendedOnline = Math.random() > 0.5
    const attendedOffline = Math.random() > 0.5
    const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP

    attendees.push({
      id: i,
      title,
      firstName,
      middleName,
      lastName,
      email: `attendee${i}@example.com`,
      phone: `+1 555-${String(i).padStart(3, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      whatsapp: `+1 777-${String(i).padStart(3, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      street: `${i} Main St`,
      state: `State ${i % 5}`,
      country: `Country`,
      gender,
      isMember,
      preferredAttendance,
      attendedOnline,
      attendedOffline,
      otp,
    })
  }

  return attendees
}

export default AttendeeList
