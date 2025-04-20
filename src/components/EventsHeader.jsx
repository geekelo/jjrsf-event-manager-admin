"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarPlus, faCalendarDays, faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons"

const EventsHeader = ({ onCreateEvent, onToggleFilters, searchTerm, onSearch }) => {
  return (
    <>
      <div className="events-header">
        <h1 className="events-title">
          <FontAwesomeIcon icon={faCalendarDays} className="title-icon" /> Events
        </h1>
        <button className="create-event-button" onClick={onCreateEvent}>
          <FontAwesomeIcon icon={faCalendarPlus} className="button-icon" />
          Create Event
        </button>
      </div>

      <div className="events-filters">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={onSearch}
              className="search-input"
            />
          </div>
        </div>
        <button className="filter-button" onClick={onToggleFilters}>
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <span>Filter & Sort</span>
        </button>
      </div>
    </>
  )
}

export default EventsHeader
