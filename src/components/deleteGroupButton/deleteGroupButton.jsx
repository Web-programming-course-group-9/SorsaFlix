import axios from "axios"
import { useAuth } from "../../context/AuthContext"

// Button that deletes a group. Only visible to the group owner.
function DeleteGroupButton({ groupId, ownerId, onDelete }) {
    //logged in user, null if logged out
    const { user } = useAuth()

    // show button only to the group owner
    if (!user || user.id !== ownerId) {
        return null
    }

    async function handleDelete() {
        try {
            // token is added automatically
            await axios.delete(`/groups/${groupId}`)
            // tell parent page to update its group list
            onDelete(groupId)
        } catch (error) {
            console.error(error.response?.data?.error || "Something went wrong.")
        }
    }

    return (
        <button type="button" onClick={handleDelete}>
            Delete Group
        </button>
    )
}

export default DeleteGroupButton