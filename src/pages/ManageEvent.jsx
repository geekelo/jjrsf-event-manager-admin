"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchEvents,
  updateEvent,
  updateEventEvaluation,
  setCurrentEvent,
  setEditMode,
  resetCurrentEvent,
} from "../redux/eventsSlice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../stylesheets/manageEvent.css"
import { isAuthenticated } from "../lib/auth/token"

// Import components
import EventHeader from "../components/event/EventHeader"
import EventDetailsSection from "../components/event/EventDetailsSection"
import EventMetricsSection from "../components/event/EventMetricsSection"
import EventEvaluationSection from "../components/event/EventEvaluationSection"
import StreamsSection from "../components/event/StreamsSection"
import PasscodeModal from "../components/PasscodeModal"

function ManageEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get event details from Redux store
  const { currentEvent: event, loading, error, isEditMode, events } = useSelector((state) => state.events)

  const [showPasscodeModal, setShowPasscodeModal] = useState(false)

  // Check authentication on component mount
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

    // Cleanup on unmount
    return () => {
      dispatch(resetCurrentEvent())
    }
  }, [dispatch, eventId, navigate, events.length])

  // When events are loaded, set the current event
  useEffect(() => {
    if (events.length > 0 && eventId) {
      dispatch(setCurrentEvent(eventId))
    }
  }, [dispatch, events, eventId])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Use direct localhost URL
  const eventUrl = `http://localhost:3000/event/${eventId}`

  // Dummy metrics data
  const metrics = {
    totalRegistered: 158,
    totalAttendedOnline: 89,
    totalAttendedOffline: 45,
    totalAttendedBoth: 12,
    totalDidNotAttend: 36,
  }

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
    // Map form field names to API field names
    const apiData = {
      name: updatedData.name,
      start_date: updatedData.startDate,
      end_date: updatedData.endDate,
      registration_deadline: updatedData.registrationDeadline,
      location: updatedData.location,
      status: updatedData.status,
      onsite: updatedData.isOnsite,
      online: updatedData.isOffline, // Note: isOffline maps to online in the API
      description: updatedData.description,
    }

    console.log("Sending update with data:", apiData)

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
    dispatch(updateEventEvaluation({ eventId, evaluation: evaluationText }))
      .unwrap()
      .then(() => {
        toast.success("Evaluation saved successfully!")
      })
      .catch((error) => {
        toast.error(error || "Failed to update evaluation")
      })
  }

  const closePasscodeModal = () => {
    setShowPasscodeModal(false)
  }

  if (loading && !event) {
    return (
      <div className="manage-event-page-background">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event && !loading) {
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

  // Map API fields to component fields
  const mappedEvent = event
    ? {
        id: event.id,
        name: event.name,
        startDate: event.start_date,
        endDate: event.end_date,
        registrationDeadline: event.registration_deadline,
        location: event.location,
        status: event.status,
        isOnsite: event.onsite,
        isOffline: event.online,
        description: event.description,
        evaluation: event.evaluation,
        imageUrl: event.image_url,
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

        <EventMetricsSection metrics={metrics} eventId={eventId} />

        <EventEvaluationSection
          event={mappedEvent}
          eventId={eventId}
          updateEventEvaluation={updateEventEvaluationHandler}
        />

        <StreamsSection event={mappedEvent} />
      </div>

      {showPasscodeModal && <PasscodeModal eventId={eventId} onClose={closePasscodeModal} />}
    </div>
  )
}

export default ManageEvent
