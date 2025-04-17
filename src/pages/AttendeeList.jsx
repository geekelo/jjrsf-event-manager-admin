import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUsers, 
  faUserCheck, 
  faUserClock,
  faSearch,
  faFilter,
  faChevronDown,
  faTimes,
  faCalendarAlt,
  faSort,
  faSortAlphaDown,
  faSortAlphaUp
} from '@fortawesome/free-solid-svg-icons';
import '../stylesheets/attendeeList.css';

const AttendeeList = () => {
  const { eventId, type } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'name-asc'
  });
  
  // Labels mapping based on type
  const typeLabels = {
    registered: 'Registered Attendees',
    online: 'Online Attendees',
    offline: 'Onsite Attendees', // Changed from 'Offline Attendees'
    both: 'Hybrid Attendees',
    absent: 'Absent Registrants'
  };
  
  // Icon mapping based on type
  const typeIcons = {
    registered: faUsers,
    online: faUserCheck,
    offline: faUserCheck,
    both: faUserCheck,
    absent: faUserClock
  };
  
  // Status options for each attendee type
  const statusOptions = {
    registered: ['All', 'Registered', 'Confirmed'],
    online: ['All', 'Attended Online', 'Late Join'],
    offline: ['All', 'Attended In-Person', 'Early Check-in'], // Consider changing to 'Attended Onsite'
    both: ['All', 'Attended Hybrid', 'VIP'],
    absent: ['All', 'No-Show', 'Cancelled']
  };
  
  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', icon: faSortAlphaDown },
    { value: 'name-desc', label: 'Name (Z-A)', icon: faSortAlphaUp },
    { value: 'date-asc', label: 'Date (Oldest First)', icon: faSort },
    { value: 'date-desc', label: 'Date (Newest First)', icon: faSort }
  ];
  
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          // Generate dummy data based on type
          const dummyAttendees = generateDummyAttendees(type, 30);
          setAttendees(dummyAttendees);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching attendees:', error);
        setLoading(false);
      }
    };
    
    fetchAttendees();
  }, [eventId, type]);
  
  const handleBack = () => {
    navigate(`/events/${eventId}`);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const toggleFilter = () => {
    setFilterActive(prev => !prev);
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      sortBy: 'name-asc'
    });
  };
  
  // Apply filters to attendees
  const filteredAttendees = attendees
    .filter(attendee => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || 
        attendee.status === filters.status;
      
      // Date range filter
      let matchesDateRange = true;
      const attendeeDate = new Date(attendee.rawDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      
      if (filters.dateRange === 'today') {
        matchesDateRange = attendeeDate >= today;
      } else if (filters.dateRange === 'yesterday') {
        matchesDateRange = attendeeDate >= yesterday && attendeeDate < today;
      } else if (filters.dateRange === 'last7') {
        matchesDateRange = attendeeDate >= last7Days;
      } else if (filters.dateRange === 'last30') {
        matchesDateRange = attendeeDate >= last30Days;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'date-asc') {
        return new Date(a.rawDate) - new Date(b.rawDate);
      } else if (filters.sortBy === 'date-desc') {
        return new Date(b.rawDate) - new Date(a.rawDate);
      }
      return 0;
    });
  
  if (loading) {
    return (
      <div className="attendee-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading attendees...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="attendee-list-page">
      <div className="attendee-list-container">
        <div className="attendee-list-header">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Back to event"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={typeIcons[type] || faUsers} />
              {typeLabels[type] || 'Attendees'}
            </h1>
            <span className="attendee-count">{filteredAttendees.length}</span>
          </div>
          
          <div className="search-container">
            <div className="search-input-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            
            <button 
              className={`filter-button ${filterActive ? 'active' : ''}`}
              onClick={toggleFilter}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filter</span>
              {(filters.status !== 'all' || filters.dateRange !== 'all' || filters.sortBy !== 'name-asc') && (
                <span className="filter-badge"></span>
              )}
            </button>
          </div>
        </div>
        
        {filterActive && (
          <div className="filter-panel">
            <div className="filter-panel-content">
              <div className="filter-group">
                <label>Status</label>
                <div className="select-wrapper">
                  <select 
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {statusOptions[type]?.map((status, index) => (
                      status !== 'All' && (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      )
                    ))}
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
                </div>
              </div>
              
              <div className="filter-group">
                <label>Date Range</label>
                <div className="select-wrapper">
                  <select 
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  >
                    {dateRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon icon={faCalendarAlt} className="select-icon" />
                </div>
              </div>
              
              <div className="filter-group">
                <label>Sort By</label>
                <div className="select-wrapper">
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon icon={faSort} className="select-icon" />
                </div>
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="clear-filters-button"
                onClick={clearFilters}
              >
                <FontAwesomeIcon icon={faTimes} />
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        <div className="attendee-list">
          <div className="attendee-list-header-row">
            <div className="attendee-name-col">Name</div>
            <div className="attendee-email-col">Email</div>
            <div className="attendee-timestamp-col">Registration Time</div>
            <div className="attendee-status-col">Status</div>
          </div>
          
          {filteredAttendees.length > 0 ? (
            filteredAttendees.map(attendee => (
              <div className="attendee-row" key={attendee.id}>
                <div className="attendee-name-col">{attendee.name}</div>
                <div className="attendee-email-col">{attendee.email}</div>
                <div className="attendee-timestamp-col">{attendee.registrationTime}</div>
                <div className="attendee-status-col">
                  <span className={`status-badge ${attendee.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {attendee.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No attendees found matching your search criteria.</p>
              {(searchTerm || filters.status !== 'all' || filters.dateRange !== 'all') && (
                <button 
                  className="clear-filters-button" 
                  onClick={() => {
                    clearSearch();
                    clearFilters();
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate dummy attendees
function generateDummyAttendees(type, count) {
  const statuses = {
    registered: ['Registered', 'Confirmed'],
    online: ['Attended Online', 'Late Join'],
    offline: ['Attended In-Person', 'Early Check-in'],
    both: ['Attended Hybrid', 'VIP'],
    absent: ['No-Show', 'Cancelled']
  };
  
  const attendees = [];
  const status = statuses[type] || ['Registered'];
  
  for (let i = 1; i <= count; i++) {
    const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    attendees.push({
      id: i,
      name: `Attendee ${i}`,
      email: `attendee${i}@example.com`,
      rawDate: randomDate, // Keep the raw date for filtering
      registrationTime: randomDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: status[Math.floor(Math.random() * status.length)]
    });
  }
  
  return attendees;
}

export default AttendeeList;