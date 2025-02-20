import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApplicationPopup from "./ApplicationPopup";

function OpportunityCard({ opportunity }) {
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    const checkAppliedStatus = async () => {
      try { 
        const response = await fetch(
          `https://internship-backend-bkhn.onrender.com/auth/applied/${opportunity.id}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to check applied status");
        }
        const data = await response.json();
        setHasApplied(data.applied);
      } catch (error) {
        console.error("Error checking applied status:", error);
      }
    };
    checkAppliedStatus();
  }, [opportunity.id]);

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to apply for Opportunity");
      navigate("/login")
      return;
    }
    setShowPopup(true);
  };

  return (
    <div className="opportunity-card">
      <h1>{opportunity.title}</h1>
      <p><strong>Company:</strong> {opportunity.company_name}</p>
      <p><strong>Stipend:</strong> {opportunity.stipend.salary}</p>
      <p><strong>Duration:</strong> {opportunity.duration}</p>
      <p><strong>Location:</strong> {opportunity.locations && opportunity.locations.length > 0 ? opportunity.locations.map((item) => item.string.trim()).filter((loc) => loc).join(", ")
        : "Remote"}
      </p>
      <button onClick={handleApplyClick} disabled={hasApplied}>
        {hasApplied ? "You have already applied" : "Apply Here"}
      </button>

      {showPopup && (
        <ApplicationPopup opportunity={opportunity} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default OpportunityCard;