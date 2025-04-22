"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"
import "../../stylesheets/platformModal.css"

const AddPlatformModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    platform_name: "",
    embed_link: "",
    visit_link: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.platform_name.trim()) {
      alert("Platform name is required")
      return
    }

    setIsSubmitting(true)

    try {
      await onAdd(formData)
    } catch (error) {
      console.error("Error adding platform:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="platform-modal-overlay">
      <div className="platform-modal">
        <div className="platform-modal-header">
          <h2>Add New Platform</h2>
          <button className="platform-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="platform-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="platform_name">Platform Name *</label>
            <input
              type="text"
              name="platform_name"
              value={formData.platform_name}
              onChange={handleChange}
              required
              placeholder="e.g., YouTube, Mixlr, Zoom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="embed_link">Embed Link *</label>
            <input
              type="text"
              name="embed_link"
              value={formData.embed_link}
              onChange={handleChange}
              required
              placeholder="e.g., https://youtube.com/embed/abc123"
            />
            <small>The URL that will be used to embed the content in an iframe.</small>
          </div>

          <div className="form-group">
            <label htmlFor="visit_link">Visit Link (Optional)</label>
            <input
              type="text"
              name="visit_link"
              value={formData.visit_link}
              onChange={handleChange}
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
            <button type="button" className="cancel-button" onClick={onClose}>
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? "Adding..." : "Add Platform"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPlatformModal
