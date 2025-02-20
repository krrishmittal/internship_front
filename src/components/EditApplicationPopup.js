import React, { useState } from "react";
import { toast } from "react-toastify";

function EditApplicationPopup({ opportunity, onClose, onUpdate }) {
    const [fullName, setFullName] = useState(opportunity.fullName || "");
    const [email, setEmail] = useState(opportunity.email || "");
    const [phone, setPhone] = useState(opportunity.phone || "");
    const [degree, setDegree] = useState(opportunity.degree || "");
    const [fieldOfStudy, setFieldOfStudy] = useState(opportunity.fieldOfStudy || "");
    const [university, setUniversity] = useState(opportunity.university || "");
    const [graduationDate, setGraduationDate] = useState(opportunity.graduationDate || "");
    const [skills, setSkills] = useState(opportunity.skills || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Login to edit Opportunity");
            return;
        }

        const updatedData = {
            id: opportunity._id, fullName, email, phone,
            degree, fieldOfStudy, university, graduationDate, skills,
        };

        try {
            const response = await fetch(`https://internship-backend-bkhn.onrender.com/auth/applied/${opportunity._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Update failed");
            }

            toast.success("Application updated successfully!");
            onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message);
        }
    };

    return (
        <div className="popup1">
            <h2>Edit Application for {opportunity.title}</h2>
            <form onSubmit={handleSubmit}>
                <label> Full Name: <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></label>
                <label> Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label> Phone Number: <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></label>
                <label> Degree: <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required /></label>
                <label> Field of Study: <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} required /></label>
                <label> University/College Name: <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required /></label>
                <label> Graduation Date: <input type="date" value={graduationDate} onChange={(e) => setGraduationDate(e.target.value)} required /></label>
                <label> Skills: <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required /></label>
                <button type="submit">Update Application</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default EditApplicationPopup;