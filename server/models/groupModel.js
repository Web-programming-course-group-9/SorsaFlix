import { pool } from '../db/index.js'

// Delete group only if user is its owner
// memberships and movies are deleted automatically (CASCADE)
export async function deleteGroup(groupId, userId) {
    const result = await pool.query(
        'DELETE FROM groups WHERE id = $1 AND owner_id = $2 RETURNING *',
        [groupId, userId]
    )
    return result.rows[0]
}

// add join request, status is 'pending' by default
export async function addJoinRequest(groupId, userId) {
    const result = await pool.query(
        'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *',
        [groupId, userId]
    )
    return result.rows[0]
}
