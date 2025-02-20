import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ApplicationPopup({ opportunity, onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to apply for Opportunity");
      navigate("/login")
      return;
    }
    const formData = new FormData();
    formData.append("id", opportunity.id);
    formData.append("title", opportunity.title);
    formData.append("company_name", opportunity.company_name);
    formData.append("duration", opportunity.duration);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("degree", degree);
    formData.append("fieldOfStudy", fieldOfStudy);
    formData.append("university", university);
    formData.append("graduationDate", graduationDate);
    formData.append("skills", skills);
    if (resume) {
      formData.append("resume", resume);
    }
    try {
      const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Application failed");
      }
      await response.json();
      toast.success("Application successful!");
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="popup">
      <h2>Apply for {opportunity.title}</h2>
      <form onSubmit={handleSubmit}>
        <label> Full Name: <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label> Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label> Phone Number: <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label> Degree: <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required /> </label>
        <label> Field of Study: <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} required />
        </label>
        <label> University/College Name: <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required />
        </label>
        <label> Graduation Date: <input type="date" value={graduationDate} onChange={(e) => setGraduationDate(e.target.value)} required />  </label>
        <label> Skills: <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required />
        </label>
        <label> Resume: <input type="file" onChange={(e) => setResume(e.target.files[0])} required />
        </label>
        <button type="submit">Submit Application</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default ApplicationPopup;