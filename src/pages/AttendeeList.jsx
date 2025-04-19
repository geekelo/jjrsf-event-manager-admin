"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faUsers } from "@fortawesome/free-solid-svg-icons"
import AttendeeCard from "../components/AttendeeCard"
import SearchAndFilterBar from "../components/SearchAndFilterBar"
import Pagination from "../components/Pagination"
import "../stylesheets/attendeeList.css"
import { fetchEventAttendees } from "../redux/attendeesSlice"

const AttendeeList = () => {
  const { eventId, type } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get attendees from Redux store
  const { attendees, loading: reduxLoading, error } = useSelector((state) => state.attendees)
  const { events } = useSelector((state) => state.events)
  const { currentEventId } = useSelector((state) => state.events)

  // Local state for filtered and displayed attendees
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

  // Fetch attendees when component mounts
  // Replace the useEffect that's causing the redirect with this one that fetches data if needed
  useEffect(() => {
    // Find event name from events array
    const currentEvent = events.find((event) => event.id === eventId)
    if (currentEvent) {
      setEventName(currentEvent.name)
    }

    // Check if we already have attendees for this event
    if (!(attendees.length > 0 && currentEventId === eventId)) {
      // If we don't have attendees data, fetch it
      dispatch(fetchEventAttendees(eventId))
    } else {
      setLoading(false)
    }
  }, [dispatch, eventId, events, attendees, currentEventId])

  // Remove this useEffect that was updating loading state based on reduxLoading:
  // useEffect(() => {
  //   if (!reduxLoading) {
  //     setLoading(false)
  //   }
  // }, [reduxLoading])

  // Add this useEffect to update loading state when Redux loading changes
  useEffect(() => {
    if (!reduxLoading) {
      setLoading(false)
    }
  }, [reduxLoading])

  // Add a useEffect to handle empty attendees array
  useEffect(() => {
    // If attendees array is defined (API call completed) but empty
    if (Array.isArray(attendees) && !reduxLoading) {
      setLoading(false)
      setFilteredAttendees([])
      setDisplayedAttendees([])
    }
  }, [attendees, reduxLoading])

  // Filter attendees based on type parameter
  useEffect(() => {
    if (Array.isArray(attendees) && attendees.length) {
      let typeFilteredAttendees = [...attendees]

      // Apply type filter based on route parameter
      switch (type) {
        case "online":
          typeFilteredAttendees = attendees.filter((a) => a.attendedOnline && !a.attendedOffline)
          break
        case "offline":
          typeFilteredAttendees = attendees.filter((a) => a.attendedOffline && !a.attendedOnline)
          break
        case "both":
          typeFilteredAttendees = attendees.filter((a) => a.attendedOnline && a.attendedOffline)
          break
        case "absent":
          typeFilteredAttendees = attendees.filter((a) => !a.attendedOnline && !a.attendedOffline)
          break
        // "registered" shows all attendees, so no filtering needed
      }

      setFilteredAttendees(typeFilteredAttendees)
      setTotalPages(Math.ceil(typeFilteredAttendees.length / itemsPerPage))
    } else {
      // Handle empty attendees array
      setFilteredAttendees([])
      setTotalPages(0)
    }

    // Always set loading to false after processing
    setLoading(false)
  }, [attendees, type, itemsPerPage])

  // Filter attendees whenever search or filters change
  useEffect(() => {
    if (Array.isArray(attendees) && attendees.length) {
      const filtered = attendees.filter((attendee) => {
        // First apply type filter
        let typeMatch = true
        switch (type) {
          case "online":
            typeMatch = attendee.attendedOnline && !attendee.attendedOffline
            break
          case "offline":
            typeMatch = attendee.attendedOffline && !attendee.attendedOnline
            break
          case "both":
            typeMatch = attendee.attendedOnline && attendee.attendedOffline
            break
          case "absent":
            typeMatch = !attendee.attendedOnline && !attendee.attendedOffline
            break
        }

        if (!typeMatch) return false

        // Search filter
        const searchMatch =
          searchTerm === "" ||
          `${attendee.title && `${attendee.title} `}${attendee.name}`
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
    } else {
      // Handle empty attendees array
      setFilteredAttendees([])
      setTotalPages(0)
      setCurrentPage(1)
    }
  }, [searchTerm, filters, attendees, type, itemsPerPage])

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

  if (loading && !error) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading attendees...</p>
        </div>
      </div>
    )
  }

  // Add error handling to the component
  if (error) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <p className="error-message">Error loading attendees: {error}</p>
          <button className="primary-button" onClick={() => navigate(`/events/${eventId}`)}>
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

export default AttendeeList
