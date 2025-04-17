import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, 
  faTimes, 
  faPlus, 
  faSave, 
  faTrash,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import '../stylesheets/passcodeModal.css';

const PasscodeModal = ({ eventId, onClose }) => {
  const modalRef = useRef(null);
  const [passcodes, setPasscodes] = useState([
    { id: 1, name: 'Front Desk Staff 1', passcode: '123456' },
    { id: 2, name: 'Security Team', passcode: '654321' },
    { id: 3, name: 'Event Manager', passcode: '987654' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', passcode: '' });
  const [editingId, setEditingId] = useState(null);
  const [showPasscode, setShowPasscode] = useState({});
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Toggle passcode visibility
  const togglePasscodeVisibility = (id) => {
    setShowPasscode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Show add form
  const showAddForm = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({ name: '', passcode: '' });
  };
  
  // Show edit form
  const showEditForm = (passcode) => {
    setShowForm(true);
    setEditingId(passcode.id);
    setFormData({ name: passcode.name, passcode: passcode.passcode });
  };
  
  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.passcode) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (editingId) {
      // Update existing passcode
      setPasscodes(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...formData } : p
      ));
      toast.success('Passcode updated successfully!');
    } else {
      // Add new passcode
      const newId = passcodes.length > 0 ? Math.max(...passcodes.map(p => p.id)) + 1 : 1;
      setPasscodes(prev => [...prev, { id: newId, ...formData }]);
      toast.success('New passcode added successfully!');
    }
    
    // Reset form
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', passcode: '' });
  };
  
  // Delete passcode
  const deletePasscode = (id) => {
    setPasscodes(prev => prev.filter(p => p.id !== id));
    toast.success('Passcode deleted successfully!');
  };

  return (
    <div className="modal-overlay">
      <div className="passcode-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faKey} /> Frontdesk Passcodes
          </h2>
          <button className="close-modal-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="passcode-list">
            {passcodes.length > 0 ? (
              <>
                <div className="passcode-list-header">
                  <span>Name</span>
                  <span>Passcode</span>
                  <span>Actions</span>
                </div>
                {passcodes.map(passcode => (
                  <div key={passcode.id} className="passcode-item">
                    <div className="passcode-name">{passcode.name}</div>
                    <div className="passcode-value">
                      {showPasscode[passcode.id] ? passcode.passcode : '••••••'}
                      <button 
                        className="toggle-visibility-button"
                        onClick={() => togglePasscodeVisibility(passcode.id)}
                        aria-label={showPasscode[passcode.id] ? 'Hide passcode' : 'Show passcode'}
                      >
                        <FontAwesomeIcon icon={showPasscode[passcode.id] ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    <div className="passcode-actions">
                      <button 
                        className="edit-button"
                        onClick={() => showEditForm(passcode)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => deletePasscode(passcode.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-passcodes-message">
                No passcodes have been created yet.
              </div>
            )}
          </div>
          
          {!showForm && (
            <button className="add-passcode-button" onClick={showAddForm}>
              <FontAwesomeIcon icon={faPlus} /> Add New Passcode
            </button>
          )}
          
          {showForm && (
            <form className="passcode-form" onSubmit={handleSubmitForm}>
              <h3>{editingId ? 'Edit Passcode' : 'Add New Passcode'}</h3>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Front Desk Staff 1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="passcode">Passcode</label>
                <input
                  type="text"
                  id="passcode"
                  name="passcode"
                  value={formData.passcode}
                  onChange={handleFormChange}
                  placeholder="Enter a numeric passcode"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  <FontAwesomeIcon icon={faSave} /> {editingId ? 'Update' : 'Add'} Passcode
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasscodeModal;