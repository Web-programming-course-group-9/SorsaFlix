import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

// list of group members with leave and remove buttons
function GroupMembers({ groupId, members, ownerId, onMemberRemoved }) {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [message, setMessage] = useState("")

    const isOwner = user?.id === ownerId

    async function handleRemove(memberId) {
        const isSelf = memberId === user?.id

        // different question for leaving and removing someone else
        const question = isSelf
            ? "Are you sure you want to leave this group?"
            : "Are you sure you want to remove this member?"

        if (!window.confirm(question)) {
            return
        }

        try {
            setMessage("")
            // token is added automatically by axiosSetup.js
            await axios.delete(`/groups/${groupId}/members/${memberId}`)

            if (isSelf) {
                // user is no longer a member, so they can't see this page
                navigate("/groups")
            } else {
                // tell the parent page to remove the member from the list
                onMemberRemoved(memberId)
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.")
        }
    }

    return (
        <section>
            <h2>Members</h2>

            <ul>
                {members.map((member) => (
                    <li key={member.id}>
                        {member.username}
                        {member.id === ownerId && " (owner)"}
                        {/* owner can remove others*/}
                        {isOwner && member.id !== ownerId && (
                            <button type="button" onClick={() => handleRemove(member.id)}>
                                Remove member
                            </button>
                        )}

                        {/* member can leave, owner can't*/}
                        {!isOwner && member.id === user?.id && (
                            <button type="button" onClick={() => handleRemove(member.id)}>
                                Leave group
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {message && <p>{message}</p>}
        </section>
    )
}

export default GroupMembers

