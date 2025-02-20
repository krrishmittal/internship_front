import React, { useState } from "react";
import OpportunitiesData from "../opportunities.json";
import OpportunityCard from "./OpportunityCard";
import video from "../assets/background-video.mp4";

function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false); 
  
  const filteredOpportunities = Object.values(OpportunitiesData.internships_meta).filter(
    (opportunity) => {
      const matchesSearchQuery =
        opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.company_name.toLowerCase().includes(searchQuery.toLowerCase());
  
      const matchesLocation = locationFilter
        ? opportunity.locations.length > 0 && 
          opportunity.locations.some((loc) => loc.string.toLowerCase() === locationFilter.toLowerCase()) 
        : true;
  
      const matchesDuration = durationFilter
        ? opportunity.duration.toLowerCase().includes(durationFilter.toLowerCase())
        : true;
  
      const matchesStipend = stipendFilter
        ? opportunity.stipend.salary.toLowerCase().includes(stipendFilter.toLowerCase())
        : true;
  
      return matchesSearchQuery && matchesLocation && matchesDuration && matchesStipend;
    }
  );

  return (
    <div className="opportunities-page">
      <video autoPlay loop muted className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="opportunities-container">
        <button className="filter-toggle-button" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div className={`filter-section ${showFilters ? "active" : ""}`}>
          <h2>Filter Opportunities</h2>
          <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="filter-input" />
          <input type="text" placeholder="Filter by location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="filter-input" />
          <input type="text" placeholder="Filter by duration..." value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="filter-input" />
          <input
            type="text" placeholder="Filter by stipend..." value={stipendFilter} onChange={(e) => setStipendFilter(e.target.value)} className="filter-input" />
        </div>

        <div className="opportunities-list">
          <h1 className="opportunities-title">Internship Opportunities</h1>
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <p>No opportunities found matching your criteria.</p>
          )}
        </div>
      </div>
    </div> 
  );
}

export default Opportunities;