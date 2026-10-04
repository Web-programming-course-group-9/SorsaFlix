import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Groups.css"
import JoinGroupButton from "../../components/joinGroupButton/joinGroupButton"
import DeleteGroupButton from "../../components/deleteGroupButton/deleteGroupButton"

// page for a single group
function GroupPage() {
    //group id from URL, e.g. /group/1
    const { groupId } = useParams()
    const navigate = useNavigate()

    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    //fetch group again if the id in URL changes
    useEffect(() => {
        async function fetchGroup() {
            try {
                setLoading(true)
                setError("")

                const response = await axios.get(`/groups/${groupId}`)
                setGroup(response.data)
            } catch (error) {
                // backend returns 404 for unknown and 400 for invalid id
                if (error.response?.status === 404 || error.response?.status === 400) {
                    setError("Group not found.")
                } else {
                    setError("Failed to load group.")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchGroup()
    }, [groupId])

    if (loading) {
        return (
            <main className="groups-page">
                <p>Loading group...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="groups-page">
                <p>{error}</p>
                <Link to="/groups">Back to groups</Link>
            </main>
        )
    }


    return (
        <main className="groups-page">
            <h1>{group.name}</h1>
            <p>Owner: {group.owner_name}</p>

            {/*buttons hide themselves when not relevant */}
            <JoinGroupButton groupId={group.id} />
            <DeleteGroupButton
                groupId={group.id}
                ownerId={group.owner_id}
                onDelete={() => navigate("/groups")}
            />
            <Link to="/groups">Back to groups</Link>
        </main>
    )
}

export default GroupPage