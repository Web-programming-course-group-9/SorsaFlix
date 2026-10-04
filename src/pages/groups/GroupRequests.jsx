import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { getAccessToken } from "../../api/tokenStore.js"
import { useAuth } from "../../context/AuthContext"
import "./GroupRequests.css"

// GroupRequests component fetches and displays pending join requests for a specific group, allowing the group owner to accept or reject them
function GroupRequests() {
  const { id } = useParams()
  const { user } = useAuth()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch pending join requests when the component mounts or when the group ID or user changes
  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true)
        setError("")

        const token = getAccessToken()

        const response = await axios.get(
          `/groups/${id}/requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
// Set the fetched requests to state
        setRequests(response.data)
      } catch (error) {
        console.error(error)

        if (error.response?.status === 401) {
          setError(
            "You must be logged in to view join requests."
          )
        } else if (error.response?.status === 403) {
          setError(
            "Only the group owner can view join requests."
          )
        } else if (error.response?.status === 404) {
          setError("Group not found.")
        } else {
          setError(
            "Failed to load join requests."
          )
        }
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchRequests()
    } else {
      setLoading(false)
      setError(
        "You must be logged in to view join requests."
      )
    }
  }, [id, user])

  // Handle accepting a join request
  async function handleAccept(requestId) {
    try {
      const token = getAccessToken()

      await axios.patch(
        `/groups/${id}/requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
// Remove the accepted request from the state
      setRequests(currentRequests =>
        currentRequests.filter(
          request => request.id !== requestId
        )
      )
    } catch (error) {
      console.error(error)
// Handle different error scenarios based on the response status
      if (error.response?.status === 403) {
        setError(
          "Only the group owner can accept join requests."
        )
      } else if (error.response?.status === 404) {
        setError("Join request not found.")
      } else {
        setError(
          "Failed to accept join request."
        )
      }
    }
  }
// Handle rejecting a join request
  async function handleReject(requestId) {
    try {
      const token = getAccessToken()

      await axios.delete(
        `/groups/${id}/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
// Remove the rejected request from the state
      setRequests(currentRequests =>
        currentRequests.filter(
          request => request.id !== requestId
        )
      )
    } catch (error) {
      console.error(error)
// Handle different error scenarios based on the response status
      if (error.response?.status === 403) {
        setError(
          "Only the group owner can reject join requests."
        )
      } else if (error.response?.status === 404) {
        setError("Join request not found.")
      } else {
        setError(
          "Failed to reject join request."
        )
      }
    }
  }
// Render loading, error, or join requests based on the current state
  if (loading) {
    return (
      <main className="group-requests-page">
        <p>Loading join requests...</p>
      </main>
    )
  }
// Render error message if there is an error and no requests
  if (error && requests.length === 0) {
    return (
      <main className="group-requests-page">
        <div className="group-requests-error">
          <h1>Join requests</h1>
          <p>{error}</p>
        </div>
      </main>
    )
  }
// Render the list of join requests if available
  return (
    <main className="group-requests-page">
      <header className="group-requests-header">
        <h1>Join requests</h1>
      </header>

      {error && (
        <p className="group-requests-message">
          {error}
        </p>
      )}

      {requests.length === 0 ? (
        <p className="group-requests-empty">
          No pending join requests.
        </p>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div
              className="request-card"
              key={request.id}
            >
              <div className="request-user">
                <span className="request-username">
                  {request.username}
                </span>
              </div>

              <div className="request-actions">
                <button
                  type="button"
                  className="request-accept-button"
                  onClick={() =>
                    handleAccept(request.id)
                  }
                >
                  Accept
                </button>

                <button
                  type="button"
                  className="request-reject-button"
                  onClick={() =>
                    handleReject(request.id)
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default GroupRequests