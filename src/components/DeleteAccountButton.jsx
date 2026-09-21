import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

function DeleteAccountButton() {
    const navigate = useNavigate()

    // get logout function from AuthContext
    const { logout } = useAuth()

    async function handleDelete() {
        // Ask for confirmation before deleting
        const confirmed = window.confirm("Are you sure you want to delete your account?")
        if (!confirmed) return
        
        try {
            // call backend DELETE route with token
            await axios.delete("/auth/account")
            // Log out: clear token and user state and go to front page
            await logout()

            
            navigate("/")
        } catch (error) {
            console.error("Error deleting account:", error)
        }
    }

    return (
        <button onClick={handleDelete}>
            Delete Account
        </button>
    )
}

export default DeleteAccountButton