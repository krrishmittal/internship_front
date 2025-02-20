import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
    const navigate = useNavigate();
    const hasLoggedOut = useRef(false);
    useEffect(() => { 
        const logoutUser = async () => {
            if (hasLoggedOut.current) return; 
            hasLoggedOut.current = true;
            try {
                localStorage.removeItem("token");
                const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });await response.json();
                if (response.ok) {
                    toast.success("Logout Successful");
                    navigate("/login");
                } else {
                    toast.error("Already logged out. Please login");
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
        navigate("/login");
        logoutUser();
    }, [navigate]);
    return 
}
export default Logout;
