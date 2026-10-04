import { useState } from 'react'
import axios from 'axios'

// from for creating a new group, calls onCreated with the new group
function CreateGroupForm({ onCreated }) {
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        // stop the browser from reloading the page
        event.preventDefault()

        try {
            setLoading(true)
            setMessage("")

            // token is added automically by axiosSetup.js
            const response = await axios.post("/groups", { name })

            setName("")
            setMessage("Group created!")
            //tell the parent page about the new group
            onCreated(response.data)
        } catch (error) {
            //sho backend's error message if there is one
            setMessage(error.response?.data?.error || "Failed to create group.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="create-group-form" onSubmit={handleSubmit}>
            <h2>Create a group</h2>

            <label htmlFor="group-name">Group name:</label>
            <input
                id="group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create group"}
            </button>

            {message && <p>{message}</p>}
        </form>
    )
}

export default CreateGroupForm
