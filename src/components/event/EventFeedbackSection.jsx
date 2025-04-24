import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,

  faArrowRight,

} from "@fortawesome/free-solid-svg-icons"

const EventFeedbackSection = ({ eventId, eventName }) => {
  const navigate = useNavigate()
 
  
  const navigateToFeedback = () => {
    navigate(`/events/${eventId}/feedback`)
  }
  return (
    <section className="feedback-section-card">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faStar} /> Event Feedback
        </h2>
      </div>

        <div className="feedback-action-container">
          <button className="view-all-feedback-button" onClick={navigateToFeedback}>
            <span className="button-text">View All Feedback</span>
            <span className="button-icon">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
  
    </section>
  )
}



export default EventFeedbackSection
