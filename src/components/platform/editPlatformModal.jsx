import React, { useState } from "react";
import { X } from "lucide-react";

const EditPlatformModal = ({ platform, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    platform_name: platform.platform_name,
    embed_link: platform.embed_link,
    visit_link: platform.visit_link,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const embed_code = formData.embed_link
        ? `<iframe src="${formData.embed_link}" frameborder="0" allowfullscreen></iframe>`
        : null;

      const updates = {
        ...formData,
        embed_code,
      };

      await onUpdate({ id: platform.id, updates });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Edit Platform</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Platform Name</label>
            <input
              type="text"
              name="platform_name"
              value={formData.platform_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Embed Link</label>
            <input
              type="text"
              name="embed_link"
              value={formData.embed_link}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Visit Link</label>
            <input
              type="text"
              name="visit_link"
              value={formData.visit_link}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Platform"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPlatformModal;
