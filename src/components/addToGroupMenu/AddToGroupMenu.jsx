import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

// Story 7: dropdown on movie page to add the movie to one of user's groups
function AddToGroupMenu({ movieId }) {
  const { user } = useAuth() // logged in user, null if logged out
  const [groups, setGroups] = useState([]) // user's groups for the dropdown
  const [selectedGroupId, setSelectedGroupId] = useState("") // chosen group
  const [message, setMessage] = useState("") // feedback text for the user

  // Fetch user's groups when component loads
  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await axios.get("/groups/my") // token is added automatically
        setGroups(response.data)
      } catch (error) {
        setMessage("Could not load your groups.")
      }
    }

    if (user) {
      fetchGroups()
    }
  }, [user])

  // Hide menu if user is not logged in or has no groups
  if (!user || groups.length === 0) {
    return null
  }

  async function handleAdd() {
    if (!selectedGroupId) return // do nothing if no group chosen
    try {
      await axios.post(`/groups/${selectedGroupId}/movies`, { movie_id: movieId })
      setMessage("Movie added to group")
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.")
    }
  }

  return (
    <span className="add-to-group">
      <select value={selectedGroupId} onChange={(event) => setSelectedGroupId(event.target.value)}>
        <option value="">Choose group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>{group.name}</option>
        ))}
      </select>
      <button type="button" onClick={handleAdd}>Add to group</button>
      {message && <span>{message}</span>}
    </span>
  )
}

export default AddToGroupMenu