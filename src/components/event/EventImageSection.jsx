
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faImage,
  faUpload,
  faTrashAlt,
  faPencilAlt,
  faSpinner,
  faExclamationTriangle,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { updateEventImage, removeEventImage } from "../../redux/imageSlice"
import { toast } from "react-toastify"

const EventImageSection = ({ eventId, imageUrl }) => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const { loading, error } = useSelector((state) => state.image)
  const [previewImage, setPreviewImage] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fallback image URL - using a direct URL that's guaranteed to work
  const fallbackImageUrl = "https://i.imgur.com/48O76J4.png"

  // Use effect to update preview when imageUrl changes
  useEffect(() => {
    setPreviewImage(null)
    setImageError(false)
  }, [imageUrl])

  // Function to handle image load errors
  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl || fallbackImageUrl)
    setImageError(true)
  }

  const handleImageLoad = () => {
    console.log("Image loaded successfully")
    setImageError(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
  
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]; // remove the "data:image/...;base64," part
  
        const apiKey = "8f1297b57b02c3a803d131d546bb2e3e";
  
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            image: base64String,
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          const uploadedImageUrl = data.data.url;
          setPreviewImage(uploadedImageUrl);
  
          dispatch(
            updateEventImage({
              eventId,
              imageUrl: uploadedImageUrl,
            })
          )
            .then(() => {
              toast.success("Image updated successfully");
            })
            .catch(() => {
              toast.error("Failed to update image");
            });
        } else {
          throw new Error(data.error?.message || "Image upload failed");
        }
      };
  
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. Please try again.");
    }
  };
  

  const confirmRemoveImage = () => {
    setShowDeleteConfirm(true)
    
    // Create a custom toast with confirm/cancel buttons
    toast.info(
      <div>
        <p>Are you sure you want to remove this event image?</p>
        <div className="toast-actions" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button 
            onClick={() => {
              handleRemoveImage()
              toast.dismiss()
            }}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            <FontAwesomeIcon icon={faCheck} /> Yes, Remove
          </button>
          <button 
            onClick={() => {
              setShowDeleteConfirm(false)
              toast.dismiss()
            }}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    )
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setShowDeleteConfirm(false)
    
    dispatch(removeEventImage(eventId))
      .then(() => {
        toast.success("Event image removed successfully")
      })
      .catch((error) => {
        toast.error("Failed to remove image")
      })
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  // Determine which image URL to use
  const displayImageUrl = previewImage || imageUrl || fallbackImageUrl

  return (
    <section className="event-image-section">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faImage} /> Event Image
        </h2>
      </div>

      <div className="event-image-content">
        <div
          className={`event-image-container ${!imageUrl && !previewImage ? "no-image" : ""}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {loading ? (
            <div className="image-loading">
              <FontAwesomeIcon icon={faSpinner} spin />
              <p>Processing image...</p>
            </div>
          ) : (
            <>
              {imageError ? (
                <div className="image-error-display">
                  <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                  <p>Unable to load image</p>
                </div>
              ) : (
                <img
                  src={displayImageUrl}
                  alt="Event"
                  className={`event-image ${!imageUrl && !previewImage ? "fallback-image" : ""}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}

              {isHovering && !loading && (
                <div className="image-overlay">
                  <button className="overlay-button change-button" onClick={triggerFileInput} title="Change image">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>

                  {(imageUrl || previewImage) && (
                    <button className="overlay-button remove-button" onClick={confirmRemoveImage} title="Remove image">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="image-error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <p>{error}</p>
          </div>
        )}

        <div className="image-actions">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="file-input" />

          <button className="primary-button upload-button" onClick={triggerFileInput} disabled={loading}>
            <FontAwesomeIcon icon={faUpload} />
            {imageUrl || previewImage ? "Change Image" : "Add Event Image"}
          </button>

          {(imageUrl || previewImage) && (
            <button className="delete-button" onClick={confirmRemoveImage} disabled={loading || showDeleteConfirm}>
              <FontAwesomeIcon icon={faTrashAlt} />
              {showDeleteConfirm ? "Confirming..." : "Remove Image"}
            </button>
          )}
        </div>

        <div className="image-help-text">
          <p>Upload a high-quality image that represents your event. Recommended size: 1200 x 630 pixels.</p>
          <p>Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF.</p>
        </div>
      </div>
    </section>
  )
}

export default EventImageSection
