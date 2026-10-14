import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Groups.css"
import { useAuth } from "../../context/AuthContext"
import CreateGroupForm from "../../components/CreateGroupForm"
import JoinGroupButton from "../../components/joinGroupButton/joinGroupButton"
import DeleteGroupButton from "../../components/deleteGroupButton/deleteGroupButton"

function Groups() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // fetch all groups once when the page opens
  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await axios.get("/groups")
        setGroups(response.data)
      } catch {
        setError("Failed to load groups.")
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  // add new group to the list without fetching everything again
  function handleGroupCreated(group) {
    // POST response has no owner_name, so use logged in user's name
    const newGroup = { ...group, owner_name: user.username }
    // keep list sorted by name like the backend does
    setGroups(prev =>
      [...prev, newGroup].sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  // remove deleted group from the list
  function handleGroupDeleted(groupId) {
    setGroups(prev => prev.filter(group => group.id !== groupId))
  }

  return (
    <main className="groups-page">
      <h1>Groups</h1>

      <p>Create and explore movie groups.</p>

      {/* only logged in users can create groups */}
      {user
        ? <CreateGroupForm onCreated={handleGroupCreated} />
        : <p>Log in to create a group.</p>}

      <h2>All groups</h2>

      {loading && <p>Loading groups...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && groups.length === 0 && <p>No groups yet.</p>}

      <ul className="group-list">
        {groups.map(group => (
          <li key={group.id} className="group-item">
            <Link to={`/group/${group.id}`}>{group.name}</Link>
            <span> by {group.owner_name}</span>

            {/* owner can delete, others can ask to join */}
            {user?.id === group.owner_id
              ? <DeleteGroupButton
                groupId={group.id}
                ownerId={group.owner_id}
                onDelete={handleGroupDeleted}
              />
              : <JoinGroupButton groupId={group.id} />}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Groups
