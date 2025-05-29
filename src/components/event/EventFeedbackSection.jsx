import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,

  faArrowRight,

} from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { fetchFeedbacks } from "../../redux/feedbackSlice"
import { useEffect } from "react"
const EventFeedbackSection = ({ eventId, eventName }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get feedbacks and loading state from redux
  const { allFeedbacks, loading } = useSelector(state => state.feedback)

  useEffect(() => {
    if (eventId) {
      dispatch(fetchFeedbacks(eventId))
    }
  }, [dispatch, eventId])

  const navigateToFeedback = () => {
    navigate(`/events/${eventId}/feedback`)
  }

  // Calculate count safely
  const feedbackCount = allFeedbacks ? allFeedbacks.length : 0

  return (
    <section className="feedback-section-card">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faStar} /> Event Feedback {loading ? "" : `(${feedbackCount})`}
        </h2>
      </div>

      <div className="feedback-action-container">
        <button className="manage-streams-button" onClick={navigateToFeedback} disabled={loading}>
          <span className="button-text">
            View All Feedback 
          </span>
          <span className="button-icon">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </div>
    </section>
  )
}

export default EventFeedbackSection
