"use client"

import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPlus, faSave, faStickyNote, faUser } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

const NotesModal = ({ attendee, isOpen, onClose }) => {
  const [notes, setNotes] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNote, setNewNote] = useState({ content: "", adminName: "" })
  const [loading, setLoading] = useState(false)
  const modalRef = useRef(null)

  // Handle clicks inside the modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only close if clicking directly on the overlay
      if (e.target.classList.contains("notes-modal-overlay")) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Fetch notes when modal opens
      fetchNotes()
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, attendee?.id, onClose])

  // Fetch notes for this attendee
  const fetchNotes = async () => {
    setLoading(true)
    try {
      // This would be replaced with an actual API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockNotes = [
          {
            id: 1,
            content: "Attendee requested special seating arrangements.",
            adminName: "John Admin",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: 2,
            content: "Confirmed attendance via phone call.",
            adminName: "Sarah Manager",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
        ]
        setNotes(mockNotes)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast.error("Failed to load notes")
      setLoading(false)
    }
  }

  // Toggle add note form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm)
    if (!showAddForm) {
      // Reset form when opening
      setNewNote({ content: "", adminName: "" })
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewNote((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Submit new note
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newNote.content.trim()) {
      toast.error("Note content cannot be empty")
      return
    }

    if (!newNote.adminName.trim()) {
      toast.error("Admin name cannot be empty")
      return
    }

    setLoading(true)
    try {
      // This would be replaced with an actual API call
      setTimeout(() => {
        // Create a new note with timestamp and ID
        const createdNote = {
          id: Date.now(),
          content: newNote.content,
          adminName: newNote.adminName,
          timestamp: new Date().toISOString(),
        }

        // Add to the beginning of the notes array (newest first)
        setNotes([createdNote, ...notes])

        // Reset form
        setNewNote({ content: "", adminName: "" })
        toast.success("Note added successfully")
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to add note")
      setLoading(false)
    }
  }

  // Format date for display
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

  if (!isOpen) return null

  // Stop event propagation to prevent clicks from affecting parent elements
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="notes-modal-overlay">
      <div className="notes-modal" ref={modalRef} onClick={handleModalClick}>
        <div className="notes-modal-header">
          <h2>
            <FontAwesomeIcon icon={faStickyNote} /> Notes 
            <span className="attendee-name-display">{attendee?.name}</span>
          </h2>
          <button className="notes-close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="notes-actions">
          <button className="add-note-button" onClick={toggleAddForm}>
            {showAddForm ? (
              <>
                <FontAwesomeIcon icon={faTimes} /> Close
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} /> Add Note
              </>
            )}
          </button>
        </div>

        {showAddForm && (
          <div className="add-note-form-container">
            <form className="add-note-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="content">Note</label>
                <textarea
                  id="content"
                  name="content"
                  value={newNote.content}
                  onChange={handleInputChange}
                  placeholder="Enter your note here..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminName">
                  <FontAwesomeIcon icon={faUser} /> Written by
                </label>
                <input
                  type="text"
                  id="adminName"
                  name="adminName"
                  value={newNote.adminName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-note-button" disabled={loading}>
                  <FontAwesomeIcon icon={faSave} /> {loading ? "Saving..." : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="notes-list-container">
          <h3>Previous Notes</h3>

          {loading && notes.length === 0 ? (
            <div className="notes-loading">
              <div className="spinner"></div>
              <p>Loading notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-content">{note.content}</div>
                  <div className="note-meta">
                    <span className="note-author">
                      <FontAwesomeIcon icon={faUser} /> {note.adminName}
                    </span>
                    <span className="note-timestamp">{formatDate(note.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notes-message">
              <p>No notes have been added for this attendee yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesModal
