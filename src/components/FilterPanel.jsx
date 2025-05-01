"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faCheck, faSort } from "@fortawesome/free-solid-svg-icons"

const FilterPanel = ({ filters, onClose, onChange, onApply }) => {
  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filter & Sort Events</h3>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="filter-panel-content">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select name="status" className="filter-select" value={filters.status} onChange={onChange}>
            <option value="all">All Statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          <select name="dateRange" className="filter-select" value={filters.dateRange} onChange={onChange}>
            <option value="all">All Dates</option>
            <option value="upcoming30">Next 30 Days</option>
            <option value="upcoming90">Next 90 Days</option>
            <option value="past">Past Events</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FontAwesomeIcon icon={faSort} /> Sort By
          </label>
          <select name="sort" value={filters.sort || ""} onChange={onChange} className="filter-select">
            <option value="">Default</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="date_asc">Date (Oldest first)</option>
            <option value="date_desc">Date (Latest first)</option>
          </select>
        </div>
      </div>

      <div className="filter-panel-footer">
        <button className="apply-filters-button" onClick={onApply}>
          <FontAwesomeIcon icon={faCheck} /> Apply Filters
        </button>
      </div>
    </div>
  )
}

export default FilterPanel
