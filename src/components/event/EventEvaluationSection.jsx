"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboard, faEdit, faSave, faTimes, faKey, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

const EventEvaluationSection = ({ event, eventId, updateEventEvaluation, deleteEventEvaluation }) => {
  const navigate = useNavigate()
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [evaluationText, setEvaluationText] = useState(event.evaluation || "")
  const [isDeleting, setIsDeleting] = useState(false)

  // Update the evaluation text when the event changes
  useEffect(() => {
    setEvaluationText(event.evaluation || "")
  }, [event])

  const handleEvaluationChange = (e) => {
    setEvaluationText(e.target.value)
  }

  const saveEvaluation = () => {
    if (!evaluationText.trim()) {
      toast.error("Evaluation text cannot be empty")
      return
    }

    updateEventEvaluation(evaluationText)
      .then(() => {
        setShowEvaluationForm(false)
      })
      .catch((error) => {
        toast.error(error || "Failed to update evaluation")
      })
  }

  const handleDeleteEvaluation = () => {
    if (window.confirm("Are you sure you want to delete this evaluation? This action cannot be undone.")) {
      setIsDeleting(true)
      deleteEventEvaluation()
        .then(() => {
          setEvaluationText("")
          setIsDeleting(false)
          toast.success("Evaluation deleted successfully")
        })
        .catch((error) => {
          setIsDeleting(false)
          toast.error("Failed to delete evaluation: " + error)
        })
    }
  }

  const navigateToPasscodes = () => {
    navigate(`/events/${eventId}/passcodes`)
  }

  // Function to render evaluation text with preserved line breaks
  const renderEvaluationWithLineBreaks = (text) => {
    if (!text) return null
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <section className="evaluation-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faClipboard} /> Event Evaluation
        </h2>
      </div>

      <div className="evaluation-content">
        {event.evaluation && !showEvaluationForm ? (
          <>
            <div className="evaluation-text red-text">{renderEvaluationWithLineBreaks(event.evaluation)}</div>
            <div className="evaluation-actions">
              {/* Always show edit button regardless of edit history */}
              <button
                className="primary-button"
                onClick={() => {
                  setEvaluationText(event.evaluation)
                  setShowEvaluationForm(true)
                }}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit Evaluation
              </button>
              <button className="delete-button" onClick={handleDeleteEvaluation} disabled={isDeleting}>
                <FontAwesomeIcon icon={faTrash} /> {isDeleting ? "Deleting..." : "Delete Evaluation"}
              </button>
            </div>
          </>
        ) : showEvaluationForm ? (
          <div className="evaluation-form">
            <textarea
              value={evaluationText}
              onChange={handleEvaluationChange}
              placeholder="Enter your evaluation of the event..."
              rows={6}
              className="red-text-input"
            ></textarea>
            <div className="form-actions">
              <button className="cancel-button" onClick={() => setShowEvaluationForm(false)}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button className="primary-button" onClick={saveEvaluation}>
                <FontAwesomeIcon icon={faSave} /> Save Evaluation
              </button>
            </div>
          </div>
        ) : (
          <div className="no-evaluation">
            <p>No evaluation has been added for this event yet.</p>
            <button className="primary-button" onClick={() => setShowEvaluationForm(true)}>
              <FontAwesomeIcon icon={faPlus} /> Add Evaluation
            </button>
          </div>
        )}
      </div>

      <div className="passcode-section">
        <button className="secondary-button" onClick={navigateToPasscodes}>
          <FontAwesomeIcon icon={faKey} /> Manage Frontdesk Passcodes
        </button>
      </div>
    </section>
  )
}

export default EventEvaluationSection