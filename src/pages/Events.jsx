"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchEvents, setSearchTerm, setFilters, createEvent, filterEvents } from "../redux/eventsSlice"
import EventsHeader from "../components/EventsHeader"
import EventCard from "../components/EventCard"
import CreateEventModal from "../components/CreateEventModal"
import FilterPanel from "../components/FilterPanel"
import NoEventsMessage from "../components/NoEventsMessage"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../stylesheets/events.css"
import { isAuthenticated } from "../lib/auth/token"

function EventsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get data from Redux store
  const { filteredEvents, loading, error, searchTerm, filters } = useSelector((state) => state.events)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  // Form data for creating a new event
  const [newEventData, setNewEventData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    status: "ongoing",
    registration_deadline: "",
    onsite: false,
    online: false,
  })

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You must be logged in to access this page")
      navigate("/admin/login")
    }
  }, [navigate])

  // Fetch events on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchEvents())
    }
  }, [dispatch])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Handle search input change
  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value))
  }

  // Handle clicking the manage button
  const handleManageEvent = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  // Handle creating a new event
  const handleCreateEvent = () => {
    setShowCreateForm(true)
  }

  // Handle closing the create form modal
  const handleCloseForm = () => {
    setShowCreateForm(false)
    // Reset form data
    setNewEventData({
      name: "",
      start_date: "",
      end_date: "",
      description: "",
      location: "",
      status: "ongoing",
      registration_deadline: "",
      onsite: false,
      online: false,
    })
  }

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setNewEventData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmitEvent = (e) => {
    e.preventDefault()

    // Validation
    if (!newEventData.name || !newEventData.start_date || !newEventData.location) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsCreatingEvent(true)

    // Dispatch the createEvent thunk
    dispatch(createEvent(newEventData))
      .unwrap()
      .then(() => {
        // Close form and show success message
        setShowCreateForm(false)
        toast.success(`Event "${newEventData.name}" created successfully!`)

        // Refresh the events list without page refresh
        dispatch(fetchEvents())
          .unwrap()
          .then(() => {
            setIsCreatingEvent(false)
          })
          .catch(() => {
            setIsCreatingEvent(false)
          })

        // Reset form data
        setNewEventData({
          name: "",
          start_date: "",
          end_date: "",
          description: "",
          location: "",
          status: "ongoing",
          registration_deadline: "",
          onsite: false,
          online: false,
        })
      })
      .catch((error) => {
        setIsCreatingEvent(false)
        toast.error(error || "Failed to create event")
      })
  }

  // Toggle filter panel
  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    dispatch(setFilters({ [name]: value }))
  }
  const handleApplyFilters = () => {
    setShowFilters(false)
    const filteredEvents = filterEvents(events, searchTerm, filters)
    setFilteredEvents(filteredEvents) 
  }
  
  // Handle view event details
  const handleViewDetails = (event) => {
    navigate(`/events/${event.id}`)
  }

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get status badge class based on event status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "upcoming":
        return "event-status-upcoming"
      case "ongoing":
        return "event-status-ongoing"
      case "completed":
        return "event-status-completed"
      default:
        return ""
    }
  }

  return (
    <div className="events-page-background">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="events-container">
        {/* Header with Title, Create Button, and Search/Filter Controls */}
        <EventsHeader
          onCreateEvent={handleCreateEvent}
          onToggleFilters={handleToggleFilters}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onClose={handleToggleFilters}
            onChange={handleFilterChange}
            onApply={handleApplyFilters}
          />
        )}

        {/* Events List */}
        <div className="events-list">
          {loading || isCreatingEvent ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{isCreatingEvent ? "Creating event..." : "Loading events..."}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  name: event.name,
                  startDate: event.start_date,
                  endDate: event.end_date,
                  location: event.location,
                  description: event.description,
                  status: event.status,
                }}
                onManage={handleManageEvent}
                onViewDetails={() => handleViewDetails(event)}
                getStatusBadgeClass={getStatusBadgeClass}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoEventsMessage onCreateEvent={handleCreateEvent} />
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventModal
          newEventData={newEventData}
          onClose={handleCloseForm}
          onSubmit={handleSubmitEvent}
          onChange={handleFormChange}
        />
      )}
    </div>
  )
}

export default EventsPage
