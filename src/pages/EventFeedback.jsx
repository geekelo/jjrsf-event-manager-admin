"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchFeedbacks } from "../redux/feedbackSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import FeedbackTabs from "../components/feedback/FeedbackTabs"
import FeedbackForm from "../components/feedback/FeedbackForm"
import FeedbackList from "../components/feedback/FeedbackList"
import "../stylesheets/feedback.css"

const EventFeedback = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Accessing feedback state from Redux
  const { allFeedbacks, loading, error } = useSelector((state) => state.feedback)
  const { events } = useSelector((state) => state.events)
  const [activeTab, setActiveTab] = useState("reviews")
  const [eventName, setEventName] = useState("Event")

  useEffect(() => {
    // Find event name
    const currentEvent = events.find((event) => event.id === eventId)
    if (currentEvent) {
      setEventName(currentEvent.name)
    }

    // Dispatch fetchFeedbacks action to get feedbacks from the API
    dispatch(fetchFeedbacks(eventId))
  }, [eventId, dispatch, events])

  const handleNewFeedback = () => {
    // Re-fetch feedbacks after submitting a new one to get the updated list
    dispatch(fetchFeedbacks(eventId))
  }

  const handleBack = () => {
    navigate(`/events/${eventId}`)
  }

  return (
    <div className="feedback-page-background">
      <div className="feedback-container">
        <div className="feedback-header">
          <button className="back-button" onClick={handleBack} aria-label="Back to event">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faStar} /> Event Feedback
            </h1>
            <p className="header-subtitle">{eventName}</p>
          </div>
        </div>

        <FeedbackForm eventId={eventId} onSuccess={handleNewFeedback} />

        <FeedbackTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <FeedbackList feedbacks={allFeedbacks} activeTab={activeTab} loading={loading} />

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default EventFeedback
