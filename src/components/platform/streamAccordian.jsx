"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlatforms, createPlatform, updatePlatform, deletePlatform } from "../../redux/platformSlice"
import { toast } from "react-toastify"
import { 
  ChevronDown, ChevronUp, FilmIcon, PlusCircle, Edit2, Trash2,
  Video, Youtube, Mic, Globe, ExternalLink, Copy, Check, Code
} from "lucide-react"
import AddPlatformModal from "./addPlatformModal"
import "../../stylesheets/streamAccordion.css"

const StreamAccordion = ({ eventId }) => {
  const dispatch = useDispatch()
  const { items: platforms, loading, error } = useSelector((state) => state.platform)

  const [isOpen, setIsOpen] = useState(true)
  const [activePlatformId, setActivePlatformId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState(null)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [copied, setCopied] = useState(false)

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
    setShowAddModal(true)
  }

  const openEditModal = (platform) => {
    setEditingPlatform(platform)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingPlatform(null)
  }

  const toggleEmbedCodeDisplay = () => {
    setShowEmbedCode(!showEmbedCode)
    setCopied(false)
  }

  const copyEmbedCode = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      (err) => {
        console.error('Could not copy text: ', err)
        toast.error("Failed to copy embed code")
      }
    )
  }

  const handleAddOrUpdatePlatform = async (formData) => {
    try {
      if (editingPlatform) {
        // Update existing platform
        await dispatch(
          updatePlatform({
            id: editingPlatform.id,
            event_id: eventId,
            updates: {
              platform_name: formData.platform_name,
              embed_link: formData.embed_link,
              embed_code: formData.embed_code,
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
            embed_code: formData.embed_code,
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
      throw error;
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

  const getPlatformIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "youtube":
        return <Youtube size={20} className="platform-icon youtube-icon" />
      case "mixlr":
        return <Mic size={20} className="platform-icon mixlr-icon" />
      case "zoom":
        return <Video size={20} className="platform-icon zoom-icon" />
      default:
        return <Globe size={20} className="platform-icon default-icon" />
    }
  }

  const getEmbedCodeToDisplay = (platform) => {
    if (platform.embed_code) {
      return platform.embed_code;
    } else if (platform.embed_link) {
      return `<iframe 
  src="${platform.embed_link}" 
  title="${platform.platform_name} content" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>`;
    }
    return null;
  }

  const renderEmbeddedContent = (platform) => {
    if (!platform?.embed_link && !platform?.embed_code) {
      return (
        <div className="no-embed-message">
          <p>No embeddable content available for this platform.</p>
          {platform?.visit_link && (
            <a href={platform.visit_link} target="_blank" rel="noopener noreferrer" className="visit-link">
              <ExternalLink size={16} /> Visit Platform
            </a>
          )}
        </div>
      )
    }

    // If embed code is provided, use it directly
    if (platform.embed_code) {
      return (
        <div className="embed-container" dangerouslySetInnerHTML={{ __html: platform.embed_code }}></div>
      )
    }

    // Otherwise, use the embed link in an iframe - consistent for all platforms
    return (
      <div className="embed-container">
        <iframe
          src={platform.embed_link}
          title={`${platform.platform_name} content`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  const renderEmbedCodeSection = (platform) => {
    const embedCode = getEmbedCodeToDisplay(platform);
    
    if (!embedCode) return null;

    return (
      <div className="embed-code-section">
        <button 
          className="embed-code-toggle" 
          onClick={toggleEmbedCodeDisplay}
        >
          <Code size={16} />
          {showEmbedCode ? "Hide Embed Code" : "Show Embed Code"}
        </button>

        {showEmbedCode && (
          <div className="embed-code-display">
            <div className="embed-code-header">
              <span>Embed Code</span>
              <button 
                className="copy-code-button" 
                onClick={() => copyEmbedCode(embedCode)}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="embed-code-content">{embedCode}</pre>
          </div>
        )}
      </div>
    );
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
          {/* Add Platform Button - Top Position */}
          <div className="add-platform-button-container top-button">
            <button className="add-platform-button" onClick={openAddModal}>
              <PlusCircle size={18} />
              Add Platform
            </button>
          </div>
          
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
                    onClick={() => setActivePlatformId(platform.id === activePlatformId ? null : platform.id)}
                  >
                    {getPlatformIcon(platform.platform_name)}
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
                      {renderEmbedCodeSection(platform)}
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Platform Modal */}
      {showAddModal && (
        <AddPlatformModal 
          onClose={closeModal} 
          onAdd={handleAddOrUpdatePlatform} 
          isEditing={!!editingPlatform}
          initialData={editingPlatform || {}}
        />
      )}
    </div>
  )
}

export default StreamAccordion
