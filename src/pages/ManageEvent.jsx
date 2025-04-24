"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchEvents,
  updateEvent,
  updateEventEvaluation,
  deleteEventEvaluation,
  setCurrentEvent,
  setEditMode,
} from "../redux/eventsSlice"
import { fetchEventAttendees } from "../redux/attendeesSlice"
import { fetchEventQuickRegistrations } from "../redux/quickRegistrationsSlice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../stylesheets/manageEvent.css"
import { isAuthenticated } from "../lib/auth/token"

// Import components
import EventHeader from "../components/event/EventHeader"
import EventDetailsSection from "../components/event/EventDetailsSection"
import EventMetricsSection from "../components/event/EventMetricsSection"
import EventEvaluationSection from "../components/event/EventEvaluationSection"
import EventFeedbackSection from "../components/event/EventFeedbackSection"
import EventImageSection from "../components/event/EventImageSection" // Add this new import
import StreamsSection from "../components/event/StreamsSection"
import PasscodeModal from "../components/PasscodeModal"

function ManageEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get event details from Redux store
  const {
    currentEvent: event,
    loading: eventLoading,
    error: eventError,
    isEditMode,
    events,
  } = useSelector((state) => state.events)

  // Get attendees data from Redux store
  const {
    metrics,
    loading: attendeesLoading,
    error: attendeesError,
    currentEventId,
  } = useSelector((state) => state.attendees)

  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [localEvent, setLocalEvent] = useState(null) // Add local state for immediate UI updates

  // Check authentication on component mount
  // Check authentication and fetch data on component mount

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You must be logged in to access this page")
      navigate("/admin/login")
      return
    }

    // If events are not loaded yet, fetch them
    if (events.length === 0) {
      dispatch(fetchEvents())
    } else {
      // Set the current event from the events array
      dispatch(setCurrentEvent(eventId))
    }

    // Only fetch attendees if we don't already have them for this event
    if (!currentEventId || currentEventId !== eventId) {
      dispatch(fetchEventAttendees(eventId))
    }

    // Fetch quick registrations for this event
    dispatch(fetchEventQuickRegistrations(eventId))

    // Cleanup on unmount
    return () => {
      // Don't reset current event when navigating to attendee list
      // We'll let the component decide when to reset
    }
  }, [dispatch, eventId, navigate, events.length, currentEventId])
  // Update the ManageEvent component to properly handle image updates
  // Find the useEffect that updates localEvent when event changes
  useEffect(() => {
    if (event) {
      setLocalEvent(event)
      console.log("Event updated:", event)
    }
  }, [event])

  // Show error toast if there's an error
  useEffect(() => {
    if (eventError) {
      toast.error(eventError)
    }
    if (attendeesError) {
      toast.error(attendeesError)
    }
  }, [eventError, attendeesError])

  // Use direct localhost URL
  const eventUrl = `https://jjrsf-event-manager.vercel.app/event/${eventId}`

  const handleBack = () => {
    navigate("/events")
  }

  const toggleEditMode = () => {
    dispatch(setEditMode(!isEditMode))
    if (isEditMode) {
      toast.success("Event details updated successfully")
    }
  }

  const updateEventData = (updatedData) => {
    // Immediately update local state for UI
    const mappedUpdatedData = {
      id: eventId,
      name: updatedData.name,
      start_date: updatedData.startDate,
      end_date: updatedData.endDate,
      registration_deadline: updatedData.registrationDeadline,
      location: updatedData.location,
      status: updatedData.status,
      onsite: updatedData.isOnsite,
      online: updatedData.isOffline,
      description: updatedData.description,
    }

    // Update local state for immediate UI refresh
    setLocalEvent((prev) => ({
      ...prev,
      ...mappedUpdatedData,
    }))

    // Map form field names to API field names
    const apiData = {
      name: updatedData.name,
      start_date: updatedData.startDate,
      end_date: updatedData.endDate,
      registration_deadline: updatedData.registrationDeadline,
      location: updatedData.location,
      status: updatedData.status,
      onsite: updatedData.onsite,
      online: updatedData.isOffline, // Note: isOffline maps to online in the API
      description: updatedData.description,
    }

    dispatch(updateEvent({ eventId, eventData: apiData }))
      .unwrap()
      .then(() => {
        toast.success("Event updated successfully")
      })
      .catch((error) => {
        toast.error(error || "Failed to update event")
      })
  }

  const copyEventUrl = () => {
    navigator.clipboard.writeText(eventUrl)
    toast.success("Event URL copied to clipboard!")
  }

  const updateEventEvaluationHandler = (evaluationText) => {
    // First update local state for immediate UI refresh
    setLocalEvent((prev) => ({
      ...prev,
      evaluation: evaluationText,
    }))

    return dispatch(updateEventEvaluation({ eventId, evaluation: evaluationText }))
      .unwrap()
      .then(() => {
        toast.success("Evaluation saved successfully!")
        return Promise.resolve() // Return a resolved promise on success
      })
      .catch((error) => {
        // If API call fails, revert local state
        setLocalEvent((prev) => ({
          ...prev,
          evaluation: event.evaluation,
        }))
        toast.error(error || "Failed to update evaluation")
        return Promise.reject(error) // Return a rejected promise on failure
      })
  }

  // Add a new function to handle evaluation deletion
  const deleteEventEvaluationHandler = () => {
    // First update local state for immediate UI refresh
    setLocalEvent((prev) => ({
      ...prev,
      evaluation: null,
    }))

    return dispatch(deleteEventEvaluation(eventId))
      .unwrap()
      .then(() => {
        return Promise.resolve()
      })
      .catch((error) => {
        // If API call fails, revert local state
        setLocalEvent((prev) => ({
          ...prev,
          evaluation: event.evaluation,
        }))
        return Promise.reject(error || "Failed to delete evaluation")
      })
  }

  const closePasscodeModal = () => {
    setShowPasscodeModal(false)
  }

  // Update loading state to consider both event and attendees loading
  const loading = eventLoading || attendeesLoading

  if (loading && !localEvent) {
    return (
      <div className="manage-event-page-background">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!localEvent && !loading) {
    return (
      <div className="manage-event-page-background">
        <div className="loading-container">
          <p>Event not found or error loading event details.</p>
          <button className="primary-button" onClick={handleBack}>
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  // Update the mappedEvent object to ensure imageUrl is properly passed
  const mappedEvent = localEvent
    ? {
        id: localEvent.id,
        name: localEvent.name,
        startDate: localEvent.start_date,
        endDate: localEvent.end_date,
        registrationDeadline: localEvent.registration_deadline,
        location: localEvent.location,
        status: localEvent.status,
        isOnsite: localEvent.onsite,
        isOffline: localEvent.online,
        description: localEvent.description,
        evaluation: localEvent.evaluation,
        imageUrl: localEvent.image_url || null, // Ensure null if undefined
      }
    : null

  return (
    <div className="manage-event-page-background">
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

      <div className="manage-event-container">
        <EventHeader event={mappedEvent} handleBack={handleBack} />

        <EventDetailsSection
          event={mappedEvent}
          eventUrl={eventUrl}
          copyEventUrl={copyEventUrl}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          updateEventData={updateEventData}
        />

        {/* Add the new Event Image Section */}
        <EventImageSection eventId={eventId} imageUrl={mappedEvent?.imageUrl} />

        <EventMetricsSection metrics={metrics} eventId={eventId} />

        <EventEvaluationSection
          event={mappedEvent}
          eventId={eventId}
          updateEventEvaluation={updateEventEvaluationHandler}
          deleteEventEvaluation={deleteEventEvaluationHandler}
        />

        <EventFeedbackSection eventId={eventId} eventName={mappedEvent?.name} />

        <StreamsSection event={mappedEvent} />
      </div>

      {showPasscodeModal && <PasscodeModal eventId={eventId} onClose={closePasscodeModal} />}
    </div>
  )
}

export default ManageEvent
