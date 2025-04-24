"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"
import "../../stylesheets/platformModal.css"

const EditPlatformModal = ({ platform, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    platform_name: platform.platform_name || "",
    embed_link: platform.embed_link || "",
    visit_link: platform.visit_link || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const embed_code = formData.embed_link
        ? `<iframe src="${formData.embed_link}" frameborder="0" allowfullscreen></iframe>`
        : null

      const updates = {
        ...formData,
        embed_code,
      }

      await onUpdate({ id: platform.id, updates })
      setIsSubmitting(false)
      onClose()
    } catch (err) {
      console.error("Update error:", err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="platform-modal-overlay">
      <div className="platform-modal">
        <div className="platform-modal-header">
          <h2>Edit Platform</h2>
          <button className="platform-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="platform-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="platform_name">Platform Name *</label>
            <input type="text" name="platform_name" value={formData.platform_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="embed_link">Embed Link *</label>
            <input type="text" name="embed_link" value={formData.embed_link} onChange={handleChange} required />
            <small>The URL that will be used to embed the content in an iframe.</small>
          </div>

          <div className="form-group">
            <label htmlFor="visit_link">Visit Link (Optional)</label>
            <input type="text" name="visit_link" value={formData.visit_link} onChange={handleChange} />
            <small>Direct URL to the content that users can visit.</small>
          </div>

          <div className="platform-form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? "Updating..." : "Update Platform"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPlatformModal
