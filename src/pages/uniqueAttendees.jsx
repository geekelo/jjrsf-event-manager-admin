"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faEnvelope, faSearch, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { fetchUniqueAttendees, sendPublicityEmail } from "../redux/notificationsSlice"
import Pagination from "../components/Pagination"
import PublicityEmailModal from "../components/notifications/PublicityEmailModal"
import "../stylesheets/uniqueAttendees.css"

const UniqueAttendees = () => {
  const dispatch = useDispatch()
  const { uniqueAttendees, totalUniqueAttendees, loadingUniqueAttendees, loading } = useSelector(
    (state) => state.notifications,
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAttendees, setFilteredAttendees] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Fetch unique attendees on component mount
  useEffect(() => {
    dispatch(fetchUniqueAttendees())
  }, [dispatch])

  // Filter attendees based on search term
  useEffect(() => {
    if (uniqueAttendees.length) {
      const filtered = uniqueAttendees.filter((attendee) =>
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAttendees(filtered)
      setCurrentPage(1) // Reset to first page when search changes
    }
  }, [searchTerm, uniqueAttendees])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage)
  const indexOfLastAttendee = currentPage * itemsPerPage
  const indexOfFirstAttendee = indexOfLastAttendee - itemsPerPage
  const currentAttendees = filteredAttendees.slice(indexOfFirstAttendee, indexOfLastAttendee)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSendEmail = (emailData) => {
    dispatch(sendPublicityEmail(emailData))
      .unwrap()
      .then(() => {
        setShowEmailModal(false)
      })
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  console.log(uniqueAttendees)

  return (
    <div className="unique-attendees-page">
      <div className="unique-attendees-container">
        <div className="unique-attendees-header">
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faUsers} /> All-Time Attendees
              <span className="attendee-count">{totalUniqueAttendees}</span>
            </h1>
            <p className="subtitle">Unique attendees who have registered for events</p>
          </div>

          <button className="send-email-button" onClick={() => setShowEmailModal(true)}>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Send Email to All</span>
          </button>
        </div>

        <div className="search-container">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-button" onClick={() => setSearchTerm("")} aria-label="Clear search">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        <div className="attendees-content">
          {loadingUniqueAttendees ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading attendees...</p>
            </div>
          ) : filteredAttendees.length > 0 ? (
            <>
              <div className="attendees-table">
                <div className="attendees-table-header">
                  <div className="email-column">Email</div>
                  <div className="date-column">Registered On</div>
                </div>

                <div className="attendees-table-body">
                  {currentAttendees.map((attendee, index) => (
                    <div className="attendee-row" key={index}>
                      <div className="email-column">
                        <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
                        {attendee.email}
                      </div>
                      <div className="date-column">{formatDate(attendee.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          ) : (
            <div className="no-results">
              <p>No attendees found matching your search criteria.</p>
              {searchTerm && (
                <button className="clear-filters-button" onClick={() => setSearchTerm("")}>
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showEmailModal && (
        <PublicityEmailModal
          onClose={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          isLoading={loading}
          totalAttendees={totalUniqueAttendees}
        />
      )}
    </div>
  )
}

export default UniqueAttendees
