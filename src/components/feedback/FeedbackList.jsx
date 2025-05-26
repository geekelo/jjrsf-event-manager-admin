"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCalendarAlt, faTrash, faComments, faQuoteRight } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { deleteFeedback } from "../../redux/feedbackSlice"
import { toast } from "react-toastify"

const FeedbackList = ({ feedbacks = [], activeTab, loading }) => {
  const dispatch = useDispatch()

  const handleDeleteFeedback = async (item) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await dispatch(deleteFeedback({ id: item.id, event_id: item.foundation_event_id })).unwrap()
        toast.success("Feedback deleted successfully")
      } catch (err) {
        console.error("Failed to delete feedback:", err)
        toast.error("Delete failed")
      }
    }
  }

  const feedbackData = feedbacks.map((f) => f.feedback || f)
const filtered = feedbackData.filter((f) => {
  if (activeTab === "reviews") {
    return f.review && f.review.trim().length > 0;
  } else {
    return f.testimony && f.testimony.trim().length > 0;
  }
});


  if (loading) {
    return (
      <div className="feedback-loading">
        <div className="spinner"></div>
        <p>Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="feedback-list-container">
      <h3 className="feedback-list-title">
        <FontAwesomeIcon icon={activeTab === "reviews" ? faComments : faQuoteRight} />
        {activeTab === "reviews" ? "Reviews" : "Testimonies"}
      </h3>

      {filtered.length === 0 ? (
        <div className="no-feedback-message">
          <p>No {activeTab === "reviews" ? "reviews" : "testimonies"} yet.</p>
        </div>
      ) : (
        <div className="feedback-grid">
          {filtered.map((item) => (
            <div key={item.id} className="feedback-card">
              <div className="feedback-card-header">
                <div className="feedback-author">
                  <FontAwesomeIcon icon={faUser} />
                  {item.name || "Anonymous"}
                </div>
                <div className="feedback-date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="feedback-content">{activeTab === "reviews" ? item.review : item.testimony}</div>
              <div className="feedback-actions">
                <button
                  onClick={() => handleDeleteFeedback(item)}
                  className="delete-feedback-button"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTrash} size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FeedbackList
