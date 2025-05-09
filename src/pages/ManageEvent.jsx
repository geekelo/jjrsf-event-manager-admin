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
  updateEventVisibility,
  deleteEvent, // Import the deleteEvent action
} from "../redux/eventsSlice"
import { fetchEventAttendees } from "../redux/attendeesSlice"
import { fetchEventQuickRegistrations } from "../redux/quickRegistrationsSlice"
import { sendReminder, sendBulkEmail } from "../redux/notificationsSlice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../stylesheets/manageEvent.css"
import "../stylesheets/notifications.css"
import { isAuthenticated } from "../lib/auth/token"

// Import components
import EventHeader from "../components/event/EventHeader"
import EventDetailsSection from "../components/event/EventDetailsSection"
import EventMetricsSection from "../components/event/EventMetricsSection"
import EventEvaluationSection from "../components/event/EventEvaluationSection"
import EventFeedbackSection from "../components/event/EventFeedbackSection"
import EventImageSection from "../components/event/EventImageSection"
import StreamsSection from "../components/event/StreamsSection"
import EventNotificationsSection from "../components/event/EventNotificationsSection"
import PasscodeModal from "../components/PasscodeModal"
import DeleteConfirmationModal from "../components/deleteModal"
import { Trash2 } from "lucide-react"

function ManageEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    currentEvent: event,
    loading: eventLoading,
    error: eventError,
    isEditMode,
    events,
  } = useSelector((state) => state.events)
  console.log(events)
  const {
    metrics,
    loading: attendeesLoading,
    error: attendeesError,
    currentEventId,
  } = useSelector((state) => state.attendees)

  // Get notifications state from Redux store
  const { reminderLoading, reminderError, reminderSuccess, bulkEmailLoading, bulkEmailError, bulkEmailSuccess } =
    useSelector((state) => state.notifications)

  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [localEvent, setLocalEvent] = useState(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false) // Manage delete modal state
  const [deleteEventName, setDeleteEventName] = useState("") // Event name for delete confirmation
  const [deleting, setDeleting] = useState(false)

  // Check authentication and fetch data on component mount
  useEffect(() => {
    if (deleting) return

    if (!isAuthenticated()) {
      toast.error("You must be logged in to access this page")
      navigate("/admin/login")
      return
    }

    const eventExists = events.find((e) => e.id === eventId)

    if (events.length === 0) {
      dispatch(fetchEvents())
    } else if (eventExists) {
      dispatch(setCurrentEvent(eventId))
    } else {
      // If event no longer exists (e.g. after deletion), don't try to fetch it
      return
    }

    if (!currentEventId || currentEventId !== eventId) {
      dispatch(fetchEventAttendees(eventId))
    }

    if (eventExists) {
      dispatch(fetchEventQuickRegistrations(eventId))
    }

    return () => {}
  }, [dispatch, eventId, navigate, events, currentEventId, deleting])

  useEffect(() => {
    if (event) {
      setLocalEvent(event)
      console.log("Event updated:", event)
    }
  }, [event])
  console.log(event)
  useEffect(() => {
    if (eventError) {
      toast.error(eventError)
    }
    if (attendeesError) {
      toast.error(attendeesError)
    }
  }, [eventError, attendeesError])
  const uniqueId = event?.unique_id ?? ""

  const eventUrl = `${import.meta.env.VITE_FRONTEND_USER_URL}/event/${uniqueId}`

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
    const mappedUpdatedData = {
      id: eventId,
      name: updatedData.name,
      start_date: updatedData.startDate,
      start_time: updatedData.startTime,
      end_date: updatedData.endDate,
      end_time: updatedData.endTime,
      registration_deadline: updatedData.registrationDeadline,
      registration_deadline_time: updatedData.registrationDeadlineTime,
      location: updatedData.location,
      status: updatedData.status,
      onsite: updatedData.onsite,
      online: updatedData.online,
      description: updatedData.description,
    }

    setLocalEvent((prev) => ({
      ...prev,
      ...mappedUpdatedData,
    }))

    const apiData = {
      name: updatedData.name,
      start_date: updatedData.startDate,
      start_time: updatedData.startTime,
      end_date: updatedData.endDate,
      end_time: updatedData.endTime,
      registration_deadline: updatedData.registrationDeadline,
      registration_deadline_time: updatedData.registrationDeadlineTime,
      location: updatedData.location,
      status: updatedData.status,
      onsite: updatedData.onsite,
      online: updatedData.online,
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

  const handleVisibilityToggle = (newVisibility) => {
    setLocalEvent((prev) => ({
      ...prev,
      visibility: newVisibility,
    }))

    return dispatch(updateEventVisibility({ eventId, visibility: newVisibility }))
      .unwrap()
      .then(() => {
        toast.success(`Event is now ${newVisibility ? "public" : "private"}`)
        return Promise.resolve()
      })
      .catch((error) => {
        setLocalEvent((prev) => ({
          ...prev,
          visibility: !newVisibility,
        }))
        toast.error(error || "Failed to update visibility")
        return Promise.reject(error)
      })
  }

  const copyEventUrl = () => {
    navigator.clipboard.writeText(eventUrl)
    toast.success("Event URL copied to clipboard!")
  }

  const updateEventEvaluationHandler = (evaluationText) => {
    setLocalEvent((prev) => ({
      ...prev,
      evaluation: evaluationText,
    }))

    return dispatch(updateEventEvaluation({ eventId, evaluation: evaluationText }))
      .unwrap()
      .then(() => {
        toast.success("Evaluation saved successfully!")
        return Promise.resolve()
      })
      .catch((error) => {
        setLocalEvent((prev) => ({
          ...prev,
          evaluation: event.evaluation,
        }))
        toast.error(error || "Failed to update evaluation")
        return Promise.reject(error)
      })
  }

  const deleteEventEvaluationHandler = () => {
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
        setLocalEvent((prev) => ({
          ...prev,
          evaluation: event.evaluation,
        }))
        return Promise.reject(error || "Failed to delete evaluation")
      })
  }

  // Handle sending reminders to attendees
  const handleSendReminder = (eventId) => {
    dispatch(sendReminder(eventId))
  }

  // Handle sending bulk emails
  const handleSendBulkEmail = (emailData) => {
    return dispatch(sendBulkEmail(emailData))
  }

  const closePasscodeModal = () => {
    setShowPasscodeModal(false)
  }

  const openDeleteModal = (eventName) => {
    setDeleteEventName(eventName)
    setDeleteModalOpen(true)
  }

  const handleDeleteEvent = () => {
    console.log(eventId)
    setDeleting(true)
    const res = dispatch(deleteEvent(eventId))

      .unwrap()
      .then(() => {
        toast.success("Event deleted successfully")
        setTimeout(() => {
          navigate("/events") // Redirect after deletion
        }, 4000)
      })
      .catch((error) => {
        toast.error(error || "Failed to delete event")
      })
    console.log(res, eventId)
    setDeleteModalOpen(false) // Close the modal after action
  }

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

  const mappedEvent = localEvent
    ? {
        id: localEvent.id,
        name: localEvent.name,
        startDate: localEvent.start_date,
        startTime: localEvent.start_time,
        endDate: localEvent.end_date,
        endTime: localEvent.end_time,
        registrationDeadline: localEvent.registration_deadline,
        registrationDeadlineTime: localEvent.registration_deadline_time,
        location: localEvent.location,
        status: localEvent.status,
        onsite: localEvent.onsite,
        online: localEvent.online,
        description: localEvent.description,
        evaluation: localEvent.evaluation,
        imageUrl: localEvent.image_url || null,
        visibility: localEvent.visibility || false,
      }
    : null
  console.log(mappedEvent)
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
          updateEventVisibility={handleVisibilityToggle}
        />

        <EventImageSection eventId={eventId} imageUrl={mappedEvent?.imageUrl} />

        <EventMetricsSection metrics={metrics} eventId={eventId} />

        {/* Add the new Notifications Section */}
        <EventNotificationsSection
          eventId={eventId}
          onSendReminder={handleSendReminder}
          onSendBulkEmail={handleSendBulkEmail}
          reminderLoading={reminderLoading}
          bulkEmailLoading={bulkEmailLoading}
        />

        <EventEvaluationSection
          event={mappedEvent}
          eventId={eventId}
          updateEventEvaluation={updateEventEvaluationHandler}
          deleteEventEvaluation={deleteEventEvaluationHandler}
        />

        <EventFeedbackSection eventId={eventId} eventName={mappedEvent?.name} />

        <StreamsSection event={mappedEvent} />

        {/* Add the delete button */}
        <button className="delete-buttons" onClick={() => openDeleteModal(mappedEvent.name)}>
          <Trash2 className="deletes-icon" /> Delete Event
        </button>
      </div>

      {showPasscodeModal && <PasscodeModal eventId={eventId} onClose={closePasscodeModal} />}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteEvent}
        eventName={deleteEventName}
      />
    </div>
  )
}

export default ManageEvent
