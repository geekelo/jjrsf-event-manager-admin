import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilm, 
  faPlus, 
  faChevronDown, 
  faChevronUp, 
  faTrash,
  faSave,
  faVideo,
  faPlayCircle,
  faPencilAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import '../stylesheets/streamAccordion.css';

// Platform icon mapping - using only solid icons
const platformIcons = {
  YouTube: faPlayCircle,
  Mixlr: faVideo,
  Zoom: faVideo
};

// Platform colors
const platformColors = {
  YouTube: '#FF0000',
  Mixlr: '#1DB954',
  Zoom: '#2D8CFF'
};

const StreamAccordion = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(event.streams.length > 0 ? event.streams[0].platform : null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStreamId, setEditingStreamId] = useState(null);
  const [streamData, setStreamData] = useState({
    platform: 'YouTube',
    embedUrl: ''
  });
  const [streams, setStreams] = useState(event.streams || []);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingStreamId(null);
    setStreamData({
      platform: 'YouTube',
      embedUrl: ''
    });
  };

  const handleEditClick = (stream) => {
    setShowAddForm(true);
    setEditingStreamId(stream.id);
    setStreamData({
      platform: stream.platform,
      embedUrl: stream.embedUrl
    });
  };

  const handleDeleteClick = (streamId) => {
    setStreams(streams.filter(stream => stream.id !== streamId));
    toast.success('Stream deleted successfully');

    // If the deleted stream was the active tab, set a new active tab
    if (streams.find(s => s.id === streamId)?.platform === activeTab) {
      const remainingStreams = streams.filter(stream => stream.id !== streamId);
      if (remainingStreams.length > 0) {
        setActiveTab(remainingStreams[0].platform);
      } else {
        setActiveTab(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStreamData({
      ...streamData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!streamData.embedUrl.trim()) {
      toast.error('Please enter a valid embed URL');
      return;
    }

    if (editingStreamId) {
      // Update existing stream
      setStreams(streams.map(stream => 
        stream.id === editingStreamId
          ? { ...stream, ...streamData }
          : stream
      ));
      toast.success('Stream updated successfully');
    } else {
      // Add new stream
      const newId = streams.length > 0 ? Math.max(...streams.map(s => s.id)) + 1 : 1;
      const newStream = {
        id: newId,
        ...streamData,
        views: 0 // Initialize with 0 views
      };
      setStreams([...streams, newStream]);
      
      // If this is the first stream, set it as active tab
      if (streams.length === 0) {
        setActiveTab(streamData.platform);
      }
      
      toast.success('Stream added successfully');
    }

    setShowAddForm(false);
    setEditingStreamId(null);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingStreamId(null);
  };

  const renderEmbeddedContent = (embedUrl, platform) => {
    if (!embedUrl) return null;

    if (platform === 'YouTube') {
      return (
        <div className="youtube-container">
          <iframe
            width="100%"
            height="315"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    } else if (platform === 'Mixlr') {
      return (
        <div className="mixlr-container">
          <iframe
            width="100%" 
            height="180"
            src={embedUrl}
            frameBorder="0" 
            title="Mixlr audio player"
          ></iframe>
        </div>
      );
    } else {
      // Generic embed for other platforms
      return (
        <div className="generic-embed-container">
          <iframe
            width="100%"
            height="315"
            src={embedUrl}
            title={`${platform} content`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  };

  return (
    <div className="stream-accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className="accordion-title">
          <FontAwesomeIcon icon={faFilm} /> Event Streams 
          <span className="stream-count">({streams.length})</span>
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>

      {isOpen && (
        <div className="accordion-content">
          {streams.length > 0 ? (
            <div className="stream-tabs-container">
              <div className="platform-tabs">
                {streams.map(stream => (
                  <button
                    key={stream.id}
                    className={`platform-tab ${activeTab === stream.platform ? 'active' : ''}`}
                    onClick={() => setActiveTab(stream.platform)}
                    style={activeTab === stream.platform ? 
                      { borderBottomColor: platformColors[stream.platform] || '#442777' } : {}}
                  >
                    <FontAwesomeIcon 
                      icon={platformIcons[stream.platform] || faVideo} 
                      style={{ color: platformColors[stream.platform] || '#442777' }}
                    />
                    {stream.platform}
                    <span className="view-count">{stream.views} views</span>
                  </button>
                ))}
              </div>

              {streams
                .filter(stream => stream.platform === activeTab)
                .map(stream => (
                  <div className="stream-content" key={stream.id}>
                    <div className="stream-actions">
                      <button
                        className="stream-edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(stream);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="stream-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(stream.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>Delete</span>
                      </button>
                    </div>
                    {renderEmbeddedContent(stream.embedUrl, stream.platform)}
                  </div>
                ))}
            </div>
          ) : (
            <div className="no-streams-message">
              No streams have been added to this event yet.
            </div>
          )}

          {showAddForm ? (
            <div className="stream-form-container">
              <form className="stream-form" onSubmit={handleSubmit}>
                <h3>{editingStreamId ? 'Edit Stream' : 'Add New Stream'}</h3>
                
                <div className="form-group">
                  <label htmlFor="platform">Platform</label>
                  <select
                    id="platform"
                    name="platform"
                    value={streamData.platform}
                    onChange={handleInputChange}
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Mixlr">Mixlr</option>
                    <option value="Zoom">Zoom</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="embedUrl">Embed URL</label>
                  <input
                    type="text"
                    id="embedUrl"
                    name="embedUrl"
                    value={streamData.embedUrl}
                    onChange={handleInputChange}
                    placeholder="Enter embed URL"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={cancelForm}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                  <button type="submit" className="save-button">
                    <FontAwesomeIcon icon={faSave} /> {editingStreamId ? 'Update' : 'Add'} Stream
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="add-stream-button-container">
              <button className="add-stream-button" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} /> Add Platform
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamAccordion;