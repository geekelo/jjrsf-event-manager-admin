"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchEventDetails,
  updateEventDetails,
  updateEventEvaluation,
  setEditMode,
  resetEventDetails,
} from "../redux/eventDetailsSlice"
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
  const { event, loading, error, isEditMode } = useSelector((state) => state.eventDetails)

  const [showPasscodeModal, setShowPasscodeModal] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You must be logged in to access this page")
      navigate("/admin/login")
    }
  }, [navigate])

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

  // Fetch event details on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchEventDetails(eventId))
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetEventDetails())
    }
  }, [dispatch, eventId])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

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
    dispatch(updateEventDetails({ eventId, eventData: updatedData }))
  }

  const copyEventUrl = () => {
    navigator.clipboard.writeText(eventUrl)
    toast.success("Event URL copied to clipboard!")
  }

  const updateEventEvaluationHandler = (evaluationText) => {
    dispatch(updateEventEvaluation({ eventId, evaluation: evaluationText }))
    toast.success("Evaluation saved successfully!")
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
        <EventHeader event={event} handleBack={handleBack} />

        <EventDetailsSection
          event={event}
          eventUrl={eventUrl}
          copyEventUrl={copyEventUrl}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          updateEventData={updateEventData}
        />

        <EventMetricsSection metrics={metrics} eventId={eventId} />

        <EventEvaluationSection event={event} eventId={eventId} updateEventEvaluation={updateEventEvaluationHandler} />

        <StreamsSection event={event} />
      </div>

      {showPasscodeModal && <PasscodeModal eventId={eventId} onClose={closePasscodeModal} />}
    </div>
  )
}

export default ManageEvent
