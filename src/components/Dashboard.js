import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import video from "../assets/background-video.mp4";
import EditApplicationPopup from "./EditApplicationPopup"; 

function Dashboard() {
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOpportunity, setCurrentOpportunity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const fetchAppliedOpportunities = async () => {
            try {
                const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/applied", {
                    credentials: "include",
                    signal: controller.signal,
                });
                if (!response.ok) {
                    toast.error("Login to view Dashboard");
                    navigate("/login");
                    return;
                }
                const data = await response.json();
                setAppliedOpportunities(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching applied opportunities:", error);
                }
            }
        };
        fetchAppliedOpportunities();
        return () => controller.abort();
    }, [navigate]);

    const handleDeleteOpportunity = async (id) => {
        try {
            const response = await fetch(`https://internship-backend-bkhn.onrender.com/auth/applied/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete opportunity");
            }
            setAppliedOpportunities((prevOpportunities) =>
                prevOpportunities.filter((opportunity) => opportunity._id !== id)
            );
            toast.success("Opportunity deleted successfully");
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            toast.error("Failed to delete opportunity");
        }
    };

    const handleEditOpportunity = (opportunity) => {
        setCurrentOpportunity(opportunity);
        setIsEditing(true);
    };

    const handleUpdateOpportunity = (updatedOpportunity) => {
        setAppliedOpportunities((prevOpportunities) =>
            prevOpportunities.map((opportunity) =>
                opportunity._id === updatedOpportunity.id ? { ...opportunity, ...updatedOpportunity } : opportunity
            )
        );
    };

    return (
        <div className="dashboard-page">
            <video autoPlay loop muted className="background-video">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="dashboard">
                <h1>Applied Opportunities</h1>
                {appliedOpportunities.length > 0 ? (
                    <ul>
                        {appliedOpportunities.map((opportunity) => (
                            <li key={opportunity._id}>
                                <h2>{opportunity.title}</h2>
                                <p><strong>Company:</strong> {opportunity.company_name}</p>
                                <p><strong>Duration:</strong> {opportunity.duration}</p>
                                <button onClick={() => handleEditOpportunity(opportunity)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteOpportunity(opportunity._id)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not applied to any opportunities yet.</p>
                )}
            </div>
            {isEditing && (
                <EditApplicationPopup
                    opportunity={currentOpportunity}
                    onClose={() => setIsEditing(false)}
                    onUpdate={handleUpdateOpportunity}
                />
            )}
        </div>
    );
}

export default Dashboard;