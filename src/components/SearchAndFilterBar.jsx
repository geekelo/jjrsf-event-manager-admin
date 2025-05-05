"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faFilter, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons"

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterActive,
  toggleFilter,
  filters,
  handleFilterChange,
  clearFilters,
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
            <button className="clear-search-button" onClick={() => setSearchTerm("")} aria-label="Clear search">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <button className={`filter-button ${filterActive ? "active" : ""}`} onClick={toggleFilter}>
          <FontAwesomeIcon icon={faFilter} />
          <span>Filter</span>
          {(filters.gender !== "all" ||
  filters.memberStatus !== "all" ||
  filters.preferredAttendance !== "all" ||
  filters.attendance !== "all" ||
  filters.familyType !== "all") && <span className="filter-badge"></span>}

        </button>
      </div>

      {filterActive && (
        <div className="filter-panel">
          <div className="filter-panel-content">
            <div className="filter-group">
              <label>Gender</label>
              <div className="select-wrapper">
                <select value={filters.gender} onChange={(e) => handleFilterChange("gender", e.target.value)}>
                  <option value="all">All</option>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>Member Status</label>
              <div className="select-wrapper">
                <select
                  value={filters.memberStatus}
                  onChange={(e) => handleFilterChange("memberStatus", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="no">Yes</option>
                  <option value="yes">No</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>

            <div className="filter-group">
              <label>Preferred Attendance</label>
              <div className="select-wrapper">
                <select
                  value={filters.preferredAttendance}
                  onChange={(e) => handleFilterChange("preferredAttendance", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="online">online</option>
                  <option value="offline">offline</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
              </div>
            </div>
            <div className="filter-group">
  <label htmlFor="familyType">Family/Person:</label>
  <div className="select-wrapper">
  <select
    id="familyType"
    value={filters.familyType}
    onChange={(e) => handleFilterChange("familyType", e.target.value)}
  >
    <option value="all">All</option>
    <option value="family">Family</option>
    <option value="person">Person</option>
  </select>
  <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
  </div>
</div>


            <div className="filter-group">
              <label>Attendance</label>
              <div className="select-wrapper">
                <select value={filters.attendance} onChange={(e) => handleFilterChange("attendance", e.target.value)}>
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
            <button className="clear-filters-button" onClick={clearFilters}>
              <FontAwesomeIcon icon={faTimes} />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchAndFilterBar
