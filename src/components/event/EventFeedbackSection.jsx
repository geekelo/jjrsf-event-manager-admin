"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchFeedbacks } from "../../redux/feedbackSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faStarHalfAlt,
  faQuoteRight,
  faArrowRight,
  faComments,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"

const EventFeedbackSection = ({ eventId, eventName }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { allFeedbacks, loading } = useSelector((state) => state.feedback)
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    reviews: 0,
    testimonies: 0,
    recentFeedback: null,
  })

  useEffect(() => {
    if (eventId) {
      dispatch(fetchFeedbacks(eventId))
    }
  }, [eventId, dispatch])

  useEffect(() => {
    if (allFeedbacks && allFeedbacks.length > 0) {
      // Calculate stats
      const reviews = allFeedbacks.filter((f) => f.review && f.review.trim() !== "").length
      const testimonies = allFeedbacks.filter((f) => f.testimony && f.testimony.trim() !== "").length

      // Get most recent feedback
      const sortedFeedback = [...allFeedbacks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setFeedbackStats({
        total: allFeedbacks.length,
        reviews,
        testimonies,
        recentFeedback: sortedFeedback[0],
      })
    } else {
      setFeedbackStats({
        total: 0,
        reviews: 0,
        testimonies: 0,
        recentFeedback: null,
      })
    }
  }, [allFeedbacks])

  const navigateToFeedback = () => {
    navigate(`/events/${eventId}/feedback`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <section className="feedback-section-card">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faStar} /> Event Feedback
        </h2>
      </div>

      <div className="feedback-content">
        <div className="feedback-stats-container">
          <div className="feedback-stat-card">
            <div className="stat-icon total">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-content">
              <h3>Total Feedback</h3>
              <div className="stat-value">{feedbackStats.total}</div>
              <p className="stat-description">Total feedback submissions from attendees</p>
            </div>
          </div>

          <div className="feedback-stat-card">
            <div className="stat-icon reviews">
              <FontAwesomeIcon icon={faComments} />
            </div>
            <div className="stat-content">
              <h3>Reviews</h3>
              <div className="stat-value">{feedbackStats.reviews}</div>
              <p className="stat-description">Detailed reviews about the event</p>
            </div>
          </div>

          <div className="feedback-stat-card">
            <div className="stat-icon testimonies">
              <FontAwesomeIcon icon={faQuoteRight} />
            </div>
            <div className="stat-content">
              <h3>Testimonies</h3>
              <div className="stat-value">{feedbackStats.testimonies}</div>
              <p className="stat-description">Testimonies shared by attendees</p>
            </div>
          </div>
        </div>

        {feedbackStats.recentFeedback ? (
          <div className="recent-feedback-preview">
            <div className="preview-header">
              <h3>
                <FontAwesomeIcon icon={faStarHalfAlt} /> Recent Feedback
              </h3>
              <span className="preview-date">{formatDate(feedbackStats.recentFeedback.created_at)}</span>
            </div>
            <div className="preview-author">From: {feedbackStats.recentFeedback.name || "Anonymous"}</div>
            <div className="preview-content">
              {feedbackStats.recentFeedback.review ? (
                <p className="preview-text">{truncateText(feedbackStats.recentFeedback.review, 150)}</p>
              ) : feedbackStats.recentFeedback.testimony ? (
                <p className="preview-text">{truncateText(feedbackStats.recentFeedback.testimony, 150)}</p>
              ) : (
                <p className="preview-text empty">No content available</p>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="feedback-loading-container">
            <div className="feedback-spinner"></div>
            <p>Loading feedback data...</p>
          </div>
        ) : (
          <div className="no-feedback-message">
            <FontAwesomeIcon icon={faStar} size="2x" className="no-feedback-icon" />
            <p>No feedback has been submitted for this event yet.</p>
            <p className="no-feedback-subtext">
              Feedback will appear here once attendees start submitting their reviews and testimonies.
            </p>
          </div>
        )}

        <div className="feedback-action-container">
          <button className="view-all-feedback-button" onClick={navigateToFeedback}>
            <span className="button-text">View All Feedback</span>
            <span className="button-icon">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export default EventFeedbackSection
