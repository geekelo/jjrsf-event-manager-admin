"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlatforms, createPlatform, updatePlatform, deletePlatform } from "../../redux/platformSlice"
import { toast } from "react-toastify"
import { ChevronDown, ChevronUp, FilmIcon, PlusCircle, Edit2, Trash2 } from "lucide-react"
import "../../stylesheets/streamAccordion.css"

const StreamAccordion = ({ eventId }) => {
  const dispatch = useDispatch()
  const { items: platforms, loading, error } = useSelector((state) => state.platform)

  const [isOpen, setIsOpen] = useState(true)
  const [activePlatformId, setActivePlatformId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState(null)
  const [formData, setFormData] = useState({
    platform_name: "",
    embed_link: "",
    visit_link: "",
  })

  useEffect(() => {
    if (eventId) {
      dispatch(fetchPlatforms(eventId))
    }
  }, [dispatch, eventId])

  useEffect(() => {
    // Set first platform as active if available
    if (platforms.length > 0 && !activePlatformId) {
      setActivePlatformId(platforms[0].id)
    }
  }, [platforms, activePlatformId])

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const openAddModal = () => {
    setEditingPlatform(null)
    setFormData({
      platform_name: "",
      embed_link: "",
      visit_link: "",
    })
    setShowAddModal(true)
  }

  const openEditModal = (platform) => {
    setEditingPlatform(platform)
    setFormData({
      platform_name: platform.platform_name || "",
      embed_link: platform.embed_link || "",
      visit_link: platform.visit_link || "",
    })
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingPlatform(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.platform_name.trim()) {
      toast.error("Platform name is required")
      return
    }

    try {
      if (editingPlatform) {
        // Update existing platform
        const embed_code = formData.embed_link
          ? `<iframe src="${formData.embed_link}" frameborder="0" allowfullscreen></iframe>`
          : null

        await dispatch(
          updatePlatform({
            id: editingPlatform.id,
            event_id: eventId,
            updates: {
              platform_name: formData.platform_name,
              embed_link: formData.embed_link,
              embed_code,
              visit_link: formData.visit_link,
            },
          }),
        ).unwrap()

        toast.success("Platform updated successfully")
      } else {
        // Create new platform
        await dispatch(
          createPlatform({
            name: formData.platform_name,
            embedUrl: formData.embed_link,
            visit_link: formData.visit_link,
            event_id: eventId,
          }),
        ).unwrap()

        toast.success("Platform added successfully")
      }

      closeModal()
      // Refresh platforms data
      dispatch(fetchPlatforms(eventId))
    } catch (error) {
      toast.error(error?.message || "An error occurred. Please try again.")
    }
  }

  const handleDeletePlatform = async (id) => {
    if (window.confirm("Are you sure you want to delete this platform? This action cannot be undone.")) {
      try {
        await dispatch(deletePlatform({ id, event_id: eventId })).unwrap()
        toast.success("Platform deleted successfully")

        // If the deleted platform was active, set a new active platform
        if (id === activePlatformId) {
          const remainingPlatforms = platforms.filter((p) => p.id !== id)
          if (remainingPlatforms.length > 0) {
            setActivePlatformId(remainingPlatforms[0].id)
          } else {
            setActivePlatformId(null)
          }
        }
      } catch (error) {
        toast.error(error?.message || "Failed to delete platform")
      }
    }
  }

  const getPlatformLogo = (name) => {
    switch (name?.toLowerCase()) {
      case "youtube":
        return "https://www.youtube.com/s/desktop/7c4be407/img/favicon_144x144.png"
      case "mixlr":
        return "https://cdn.mixlr.com/images/favicons/favicon-196x196.png"
      case "zoom":
        return "https://st1.zoom.us/zoom.ico"
      default:
        return "https://via.placeholder.com/40x40?text=LOGO"
    }
  }

  const renderEmbeddedContent = (platform) => {
    if (!platform?.embed_link && !platform?.embed_code) {
      return (
        <div className="no-embed-message">
          <p>No embeddable content available for this platform.</p>
          {platform?.visit_link && (
            <a href={platform.visit_link} target="_blank" rel="noopener noreferrer" className="visit-link">
              Visit Platform
            </a>
          )}
        </div>
      )
    }

    // For YouTube
    if (platform.platform_name?.toLowerCase() === "youtube") {
      return (
        <div className="youtube-container">
          <iframe
            width="100%"
            height="400"
            src={platform.embed_link}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )
    }

    // For Mixlr
    if (platform.platform_name?.toLowerCase() === "mixlr") {
      return (
        <div className="mixlr-container">
          <iframe
            width="100%"
            height="180"
            src={platform.embed_link}
            frameBorder="0"
            title="Mixlr audio player"
          ></iframe>
        </div>
      )
    }

    // Generic embed for other platforms
    return (
      <div className="generic-embed-container">
        <iframe
          width="100%"
          height="400"
          src={platform.embed_link}
          title={`${platform.platform_name} content`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  return (
    <div className="stream-accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className="accordion-title">
          <FilmIcon size={20} className="accordion-icon" /> Event Streams
          <span className="stream-count">({platforms.length})</span>
        </div>
        {isOpen ? <ChevronUp className="accordion-chevron" /> : <ChevronDown className="accordion-chevron" />}
      </div>

      {isOpen && (
        <div className="accordion-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Loading platforms...</span>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : platforms.length === 0 ? (
            <div className="no-platforms-message">
              <p>No platforms have been added to this event yet.</p>
            </div>
          ) : (
            <div className="stream-tabs-container">
              <div className="platform-tabs">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    className={`platform-tab ${activePlatformId === platform.id ? "active" : ""}`}
                    onClick={() => setActivePlatformId(activePlatformId === platform.id ? null : platform.id)}
                  >
                    <img
                      src={getPlatformLogo(platform.platform_name) || "/placeholder.svg"}
                      alt={`${platform.platform_name} logo`}
                    />
                    {platform.platform_name}
                    <span className="view-count">{platform.views ?? 0} views</span>
                  </button>
                ))}
              </div>

              {platforms.map(
                (platform) =>
                  activePlatformId === platform.id && (
                    <div className="stream-content" key={platform.id}>
                      <div className="stream-actions">
                        <button className="stream-edit-button" onClick={() => openEditModal(platform)}>
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button className="stream-delete-button" onClick={() => handleDeletePlatform(platform.id)}>
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                      {renderEmbeddedContent(platform)}
                    </div>
                  ),
              )}
            </div>
          )}

          <div className="add-platform-button-container">
            <button className="add-platform-button" onClick={openAddModal}>
              <PlusCircle size={18} />
              Add Platform
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Platform Modal */}
      {showAddModal && (
        <div className="platform-modal-overlay">
          <div className="platform-modal">
            <div className="platform-modal-header">
              <h2>{editingPlatform ? "Edit Platform" : "Add New Platform"}</h2>
              <button className="platform-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="platform-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="platform_name">Platform Name *</label>
                <input
                  type="text"
                  id="platform_name"
                  name="platform_name"
                  value={formData.platform_name}
                  onChange={handleInputChange}
                  placeholder="e.g., YouTube, Mixlr, Zoom"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="embed_link">Embed Link *</label>
                <input
                  type="text"
                  id="embed_link"
                  name="embed_link"
                  value={formData.embed_link}
                  onChange={handleInputChange}
                  placeholder="e.g., https://youtube.com/embed/abc123"
                  required
                />
                <small>The URL that will be used to embed the content in an iframe.</small>
              </div>

              <div className="form-group">
                <label htmlFor="visit_link">Visit Link (Optional)</label>
                <input
                  type="text"
                  id="visit_link"
                  name="visit_link"
                  value={formData.visit_link}
                  onChange={handleInputChange}
                  placeholder="e.g., https://youtube.com/watch?v=abc123"
                />
                <small>Direct URL to the content that users can visit.</small>
              </div>

              {formData.embed_link && (
                <div className="preview-container">
                  <p>
                    <strong>Note:</strong> Embed preview will be available after saving.
                  </p>
                </div>
              )}

              <div className="platform-form-actions">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingPlatform ? "Update" : "Add"} Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamAccordion
