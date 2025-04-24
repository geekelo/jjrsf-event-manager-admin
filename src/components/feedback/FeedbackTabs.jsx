"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComments, faQuoteRight } from "@fortawesome/free-solid-svg-icons"

const FeedbackTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="feedback-tabs">
      <button
        className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
        onClick={() => setActiveTab("reviews")}
      >
        <FontAwesomeIcon icon={faComments} />
        <span>Reviews</span>
      </button>
      <button
        className={`tab-button ${activeTab === "testimonies" ? "active" : ""}`}
        onClick={() => setActiveTab("testimonies")}
      >
        <FontAwesomeIcon icon={faQuoteRight} />
        <span>Testimonies</span>
      </button>
    </div>
  )
}

export default FeedbackTabs
