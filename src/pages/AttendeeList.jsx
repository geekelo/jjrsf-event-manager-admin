"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faUsers } from "@fortawesome/free-solid-svg-icons"
import AttendeeCard from "../components/AttendeeCard"
import SearchAndFilterBar from "../components/SearchAndFilterBar"
import Pagination from "../components/Pagination"
import "../stylesheets/attendeeList.css"
import { fetchEventAttendees } from "../redux/attendeesSlice"
import { fetchEventQuickRegistrations } from "../redux/quickRegistrationsSlice"

const AttendeeList = () => {
  const { eventId, type } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state
  const {
    attendees,
    loading: attendeesLoading,
    error: attendeesError,
    currentEventId,
  } = useSelector((state) => state.attendees)
  const {
    quickRegistrations,
    loading: quickRegLoading,
    error: quickRegError,
  } = useSelector((state) => state.quickRegistrations)
  const { events } = useSelector((state) => state.events)

  // Local state
  const [combinedAttendees, setCombinedAttendees] = useState([])
  const [filteredAttendees, setFilteredAttendees] = useState([])
  const [displayedAttendees, setDisplayedAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState(false)
  const [eventName, setEventName] = useState("Event Name")
  const [dataFetched, setDataFetched] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    gender: "all",
    memberStatus: "all",
    preferredAttendance: "all",
    attendance: "all",
    familyType: "all",
  })

  // Set event name
  useEffect(() => {
    const currentEvent = events.find((event) => event.id === eventId)
    if (currentEvent) {
      setEventName(currentEvent.name)
    }
  }, [eventId, events])

  // Fetch attendees and quick registrations if needed
  useEffect(() => {
    if (!dataFetched || currentEventId !== eventId) {
      dispatch(fetchEventAttendees(eventId))
      dispatch(fetchEventQuickRegistrations(eventId))
      setDataFetched(true)
    }
  }, [dispatch, eventId, dataFetched, currentEventId])

  // Sync local loading state
  useEffect(() => {
    setLoading(attendeesLoading || quickRegLoading)
  }, [attendeesLoading, quickRegLoading])

  // Combine attendees and quick registrations
  useEffect(() => {
    if (!attendeesLoading && !quickRegLoading) {
      // Transform quick registrations to match attendee format
      const transformedQuickRegs = quickRegistrations.map((reg) => ({
        ...reg,
        // Add camelCase properties for consistency
        id: reg.id,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        gender: reg.gender,
        isMember: reg.member,
        preferredAttendance: reg.preferred_attendance,
        attendedOnline: reg.attended_online,
        attendedOffline: reg.attended_offline,
        isFamily: reg.family,
        familyMembers: reg.family_members,
        createdAt: reg.created_at,
        updatedAt: reg.updated_at,
        // Add a flag to identify the source
        isQuickRegistration: true,
      }))

      // Add a flag to regular attendees
      const flaggedAttendees = attendees.map((attendee) => ({
        ...attendee,
        isQuickRegistration: false,
      }))

      // Combine both arrays
      setCombinedAttendees([...flaggedAttendees, ...transformedQuickRegs])
    }
  }, [attendees, quickRegistrations, attendeesLoading, quickRegLoading])

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!Array.isArray(combinedAttendees)) return []

    return combinedAttendees.filter((attendee) => {
      // Check for both snake_case and camelCase properties
      const attendedOnline = attendee.attended_online || attendee.attendedOnline
      const attendedOffline = attendee.attended_offline || attendee.attendedOffline

      // Filter by type (based on URL param)
      let typeMatch = true
      switch (type) {
        case "online":
          typeMatch = attendedOnline && !attendedOffline
          break
        case "offline":
          typeMatch = attendedOffline && !attendedOnline
          break
        case "both":
          typeMatch = attendedOnline && attendedOffline
          break
        case "absent":
          typeMatch = !attendedOnline && !attendedOffline
          break
        case "registered":
        default:
          typeMatch = true
      }
      if (!typeMatch) return false

      const searchLower = searchTerm.toLowerCase()
      const searchMatch =
        searchTerm === "" ||
        `${attendee.title ? attendee.title + " " : ""}${attendee.name}`.toLowerCase().includes(searchLower) ||
        (attendee.email && attendee.email.toLowerCase().includes(searchLower)) ||
        (attendee.phone && attendee.phone.toLowerCase().includes(searchLower))

      const genderMatch = filters.gender === "all" || attendee.gender === filters.gender
      const memberMatch =
        filters.memberStatus === "all" ||
        (filters.memberStatus === "yes" && (attendee.isMember || attendee.member)) ||
        (filters.memberStatus === "no" && !(attendee.isMember || attendee.member))

      const preferredMatch =
        filters.preferredAttendance === "all" ||
        attendee.preferredAttendance === filters.preferredAttendance ||
        attendee.preferred_attendance === filters.preferredAttendance

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

      const familyMatch =
        filters.familyType === "all" ||
        (filters.familyType === "family" && (attendee.isFamily || attendee.family)) ||
        (filters.familyType === "person" && !(attendee.isFamily || attendee.family))

      return searchMatch && genderMatch && memberMatch && preferredMatch && attendanceMatch && familyMatch
    })
  }, [combinedAttendees, type, searchTerm, filters])

  // Filter attendees when filters/search change
  useEffect(() => {
    const filtered = applyFilters()
    setFilteredAttendees(filtered)
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)))
    setCurrentPage(1)
  }, [applyFilters, itemsPerPage])

  // Paginate results
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedAttendees(filteredAttendees.slice(startIndex, endIndex))
  }, [filteredAttendees, currentPage, itemsPerPage])

  // Handlers
  const handleBack = () => navigate(`/events/${eventId}`)
  const toggleFilter = () => setFilterActive((prev) => !prev)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }
  const clearFilters = () => {
    setFilters({
      gender: "all",
      memberStatus: "all",
      preferredAttendance: "all",
      attendance: "all",
      familyType: "all",
    })
    setSearchTerm("")
  }
  const handlePageChange = (page) => {
    setCurrentPage(page)
    document.querySelector(".attendee-content")?.scrollIntoView({ behavior: "smooth" })
  }
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
  }

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

  // Render
  if (loading && !attendeesError && !quickRegError) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading attendees...</p>
        </div>
      </div>
    )
  }

  if (attendeesError || quickRegError) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <p className="error-message">Error loading attendees: {attendeesError || quickRegError}</p>
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
                  <AttendeeCard
                    key={`${attendee.isQuickRegistration ? "qr-" : ""}${attendee.id}`}
                    attendee={attendee}
                  />
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
