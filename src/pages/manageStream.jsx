"use client"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, FilmIcon } from "lucide-react"
import StreamAccordion from "../components/platform/streamAccordian"
import "../stylesheets/manageStream.css"

function ManageStream() {
  const navigate = useNavigate()
  const { eventId } = useParams()

  const handleBack = () => {
    navigate(`/events/${eventId}`)
  }

  return (
    <div className="manage-stream-page">
      <div className="stream-container">
        <div className="stream-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h2>
            <FilmIcon size={24} />
            Manage Stream
          </h2>
        </div>

        <div className="stream-accordion-wrapper">
          <StreamAccordion eventId={eventId} />
        </div>
      </div>
    </div>
  )
}

export default ManageStream
