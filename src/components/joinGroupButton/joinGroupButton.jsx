import {useState} from 'react'
import axios from 'axios'
import {useAuth} from '../../context/AuthContext'

// button sends a join request to a group
function JoinGroupButton({groupId}) {
    // logged in user, null if logged out
    const {user} = useAuth()
    // feedback text for user
    const [message, setMessage] = useState("")

    // hide button if user is not logged in
    if (!user) {
        return null
    }

    async function handleJoin() {
        // ask user to confirm before sending
        if (!window.confirm("Send join request to this group?")) {
            return
        }
        try {
            // token is added automatically
            await axios.post(`/groups/${groupId}/join`)
            setMessage("Join request sent!")
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.")
        }
    }

    return (
        <div>
            <button type="button" onClick={handleJoin}>
                Join Group
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}
export default JoinGroupButton