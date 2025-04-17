import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faKey, 
  faTimes, 
  faPlus, 
  faSave, 
  faTrash,
  faEye,
  faEyeSlash,
  faSearch,
  faUser,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import '../stylesheets/passcodeManagement.css';

const PasscodeManagement = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [passcodes, setPasscodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', passcode: '' });
  const [editingId, setEditingId] = useState(null);
  const [showPasscode, setShowPasscode] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPasscodes = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const dummyPasscodes = [
            { id: 1, name: 'Front Desk Staff 1', passcode: '123456' },
            { id: 2, name: 'Security Team', passcode: '654321' },
            { id: 3, name: 'Event Manager', passcode: '987654' },
            { id: 4, name: 'VIP Check-in', passcode: '555555' },
            { id: 5, name: 'Backup Staff', passcode: '111222' }
          ];
          
          setPasscodes(dummyPasscodes);
          setLoading(false);
        }, 800);
      } catch (error) {
        toast.error('Failed to load passcodes', error);
        setLoading(false);
      }
    };
    
    fetchPasscodes();
  }, [eventId]);
  
  const handleBack = () => {
    navigate(`/events/${eventId}`);
  };
  
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
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
  
  // Filter passcodes based on search term
  const filteredPasscodes = passcodes.filter(passcode => 
    passcode.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="passcode-management-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading passcodes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="passcode-management-page">
      <div className="passcode-management-container">
        <div className="passcode-header">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Back to event"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <h1>
            <FontAwesomeIcon icon={faKey} /> Manage Frontdesk Passcodes
          </h1>
        </div>
        
        <div className="search-bar">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text"
              placeholder="Search passcodes..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
        
        <div className="passcode-list-container">
          {filteredPasscodes.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <table className="passcode-table desktop-view">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Passcode</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasscodes.map(passcode => (
                    <tr key={passcode.id}>
                      <td>{passcode.name}</td>
                      <td>
                        <div className="passcode-value-container">
                          <span className="passcode-value">
                            {showPasscode[passcode.id] ? passcode.passcode : '••••••'}
                          </span>
                          <button 
                            className="toggle-visibility-button"
                            onClick={() => togglePasscodeVisibility(passcode.id)}
                            aria-label={showPasscode[passcode.id] ? 'Hide passcode' : 'Show passcode'}
                          >
                            <FontAwesomeIcon icon={showPasscode[passcode.id] ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="passcode-actions">
                          <button 
                            className="edit-passcode-button"
                            onClick={() => showEditForm(passcode)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-passcode-button"
                            onClick={() => deletePasscode(passcode.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mobile Card View */}
              <div className="mobile-passcode-cards">
                {filteredPasscodes.map(passcode => (
                  <div className="passcode-card" key={passcode.id}>
                    <div className="card-header">
                      <div className="card-title">
                        <FontAwesomeIcon icon={faUser} className="card-icon" />
                        {passcode.name}
                      </div>
                      <div className="card-actions">
                        <button 
                          className="mobile-edit-button"
                          onClick={() => showEditForm(passcode)}
                          aria-label="Edit passcode"
                        >
                          Edit
                        </button>
                        <button 
                          className="mobile-delete-button"
                          onClick={() => deletePasscode(passcode.id)}
                          aria-label="Delete passcode"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card-field">
                        <span className="field-label">
                          <FontAwesomeIcon icon={faLock} /> Passcode:
                        </span>
                        <div className="field-value">
                          <span className="passcode-value">
                            {showPasscode[passcode.id] ? passcode.passcode : '••••••'}
                          </span>
                          <button 
                            className="mobile-toggle-button"
                            onClick={() => togglePasscodeVisibility(passcode.id)}
                          >
                            <FontAwesomeIcon 
                              icon={showPasscode[passcode.id] ? faEyeSlash : faEye} 
                              className="toggle-icon"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-passcodes-message">
              {searchTerm ? 'No passcodes match your search.' : 'No passcodes have been created yet.'}
            </div>
          )}
          
          {!showForm && (
            <button className="add-passcode-button" onClick={showAddForm}>
              <FontAwesomeIcon icon={faPlus} /> Add New Passcode
            </button>
          )}
        </div>
        
        {showForm && (
          <div className="passcode-form-container">
            <form className="passcode-form" onSubmit={handleSubmitForm}>
              <h2>{editingId ? 'Edit Passcode' : 'Add New Passcode'}</h2>
              
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
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="save-button">
                  <FontAwesomeIcon icon={faSave} /> {editingId ? 'Update' : 'Add'} Passcode
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasscodeManagement;