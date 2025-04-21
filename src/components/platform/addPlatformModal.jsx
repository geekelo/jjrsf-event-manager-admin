import React, { useState } from "react";
import { X } from "lucide-react";

const AddPlatformModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    platform_name: "",
    embed_link: "",
    visit_link: "",
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
      await onAdd(formData);
    } catch (error) {
      console.error("Error adding platform:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Add New Platform</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Platform Name</label>
            <input
              type="text"
              name="platform_name"
              value={formData.platform_name}
              onChange={handleChange}
              required
              placeholder="e.g., YouTube"
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
              placeholder="e.g., https://youtube.com/embed/abc123"
            />
          </div>
          {formData.embedUrl && (
            <div>
              <label>Embed code</label>
              <div
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="${formData.embedUrl}" frameborder="0" allowfullscreen class="w-full h-48"></iframe>`,
                }}
              />
            </div>
          )}

          <div>
            <label>Visit Link</label>
            <input
              type="text"
              name="visit_link"
              value={formData.visit_link}
              onChange={handleChange}
              placeholder="e.g., https://youtube.com/watch?v=abc123"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Platform"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlatformModal;
