import { useNavigate } from "react-router-dom"
import axios from "axios"

function DeleteAccountButton() {
    const navigate = useNavigate()

    async function handleDelete() {
        // Ask for confirmation before deleting
        const confirmed = window.confirm("Are you sure you want to delete your account?")
        if (!confirmed) return

        // Get the login token from the browser 
        const token = localStorage.getItem("token")

        try {
            // call backend DELETE route with token
            await axios.delete("/auth/account", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            // Log out: remove token and go to front page
            localStorage.removeItem("token")
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