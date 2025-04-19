import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faTimes,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const SearchAndFilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterActive, 
  toggleFilter,
  filters, 
  handleFilterChange, 
  clearFilters 
}) => {
  return (
    <>
      <div className="search-container">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-button"
              onClick={() => setSearchTerm("")}
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
          {(filters.gender !== 'all' || 
            filters.memberStatus !== 'all' || 
            filters.preferredAttendance !== 'all' ||
            filters.attendance !== 'all') && (
            <span className="filter-badge"></span>
          )}
        </button>
      </div>
      
      {filterActive && (
        <div className="filter-panel">
          <div className="filter-panel-content">
            <div className="filter-group">
              <label>Gender</label>
              <div className="select-wrapper">
                <select 
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Member Status</label>
              <div className="select-wrapper">
                <select 
                  value={filters.memberStatus}
                  onChange={(e) => handleFilterChange('memberStatus', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Preferred Attendance</label>
              <div className="select-wrapper">
                <select 
                  value={filters.preferredAttendance}
                  onChange={(e) => handleFilterChange('preferredAttendance', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Attendance</label>
              <div className="select-wrapper">
                <select 
                  value={filters.attendance}
                  onChange={(e) => handleFilterChange('attendance', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="online">Attended Online</option>
                  <option value="offline">Attended Offline</option>
                  <option value="both">Attended Both</option>
                  <option value="none">No Attendance</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
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
    </>
  );
};

export default SearchAndFilterBar;