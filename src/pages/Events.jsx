import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventsHeader from '../components/EventsHeader';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import FilterPanel from '../components/FilterPanel';
import NoEventsMessage from '../components/NoEventsMessage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../stylesheets/events.css';
import { createAxiosInstance } from '../config/axios';
import { formatDate } from '../components/utils/date';
import { getStatusBadgeClass } from '../components/utils/status';

function EventsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Event and API states
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form data for creating a new event
  const [newEventData, setNewEventData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    location: '',
    status: '',
    registration_deadline: '',
    online: '',
    onsite: '',
  });
console.log(newEventData)
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'date'
  });

  // Fetch foundation events data
  const getfetchFoundationEvents = async () => {
    try {
      const axiosInstance = createAxiosInstance();  
      const response = await axiosInstance.get('/api/v1/foundation_events'); 
      return response.data;  // Return the data
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error(error);
      return []; 
    }
  };
  

  // Fetch events on page load
  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await getfetchFoundationEvents(); 
      setEvents(fetchedEvents);  
      setLoading(false);
    };
    loadEvents();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking the manage button
  const handleManageEvent = (eventId) => {
    toast.info(`Opening management page for event #${eventId}`);
    navigate(`/events/${eventId}`);
  };

  // Handle creating a new event
  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  // Handle closing the create form modal
  const handleCloseForm = () => {
    setShowCreateForm(false);
    // Reset form data
    setNewEventData({
      name: '',
      start_date: '',
      end_date: '',
      description: '',
      location: '',
      status: 'ongoing',
      registration_deadline: '',
      online: false,
      onsite: false
    });
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!newEventData.name || !newEventData.start_date || !newEventData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    // Show loading state
    setLoading(true);
  
    // Map the form data to the API format
    const apiEventData = {
      name: newEventData.name,
      description: newEventData.description,
      location: newEventData.location,
      status: newEventData.status,
      registration_deadline: newEventData.registration_deadline,
      start_date: newEventData.start_date,  // Align with API field
      end_date: newEventData.end_date,      // Align with API field
      onsite: newEventData.onsite === 'true', // Convert 'onsite' to 'isOffline' (boolean)
      online: newEventData.online === 'true'
    };
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.post('/api/v1/foundation_events', { event: apiEventData });
      const newEvent = response.data.event;
      setEvents((prevEvents) => [newEvent, ...prevEvents].sort((a, b) => new Date(b.start_date) - new Date(a.start_date)));
  
      // Close form and show success message
      setShowCreateForm(false);
      toast.success(`Event "${newEvent.name}" created successfully!`);
  
      // Reset form data
      setNewEventData({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        location: '',
        status: 'upcoming',
        registration_deadline: '',
        online: false,
        onsite: false,
      });
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  

  // Toggle filter panel
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle view event details
  const handleViewDetails = (event) => {
    toast.info(`Viewing details for: ${event.name}`);
    navigate(`/events/${event.id}`);
  };

  // Apply filters and search to events
  const filteredEvents = events.filter(event => {
    // Text search
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    
    // Date range filter
    let matchesDate = true;
    const today = new Date();
    const eventStartDate = new Date(event.start_date);
    
    if (filters.dateRange === 'upcoming30') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      matchesDate = eventStartDate >= today && eventStartDate <= thirtyDaysFromNow;
    } else if (filters.dateRange === 'upcoming90') {
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      matchesDate = eventStartDate >= today && eventStartDate <= ninetyDaysFromNow;
    } else if (filters.dateRange === 'past') {
      matchesDate = eventStartDate < today;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort filtered events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === 'date') {
      return new Date(a.start_date) - new Date(b.start_date);
    } else if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="events-page-background">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="events-container">
        {/* Header with Title, Create Button, and Search/Filter Controls */}
        <EventsHeader 
          onCreateEvent={handleCreateEvent}
          onToggleFilters={handleToggleFilters}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onClose={handleToggleFilters}
            onChange={handleFilterChange}
            onApply={handleToggleFilters}
          />
        )}

        {/* Events List */}
        <div className="events-list">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onManage={handleManageEvent}
                onViewDetails={handleViewDetails}
                getStatusBadgeClass={getStatusBadgeClass}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoEventsMessage onCreateEvent={handleCreateEvent} />
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventModal
          newEventData={newEventData}
          onClose={handleCloseForm}
          onSubmit={handleSubmitEvent}
          onChange={handleFormChange}
        />
      )}
    </div>
  );
}

export default EventsPage;
