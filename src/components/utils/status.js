export const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'upcoming':
        return 'event-status-upcoming';
      case 'ongoing': // Changed from 'planning'
        return 'event-status-ongoing'; // You might want to update this class name too
      case 'completed':
        return 'event-status-completed';
      default:
        return '';
    }
  };