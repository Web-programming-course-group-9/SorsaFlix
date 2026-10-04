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

// create group, creator becomes owner and an accepted member
// both inserts run in one transaction: either both succeed or neither
export async function createGroup(name, ownerId) {
    // transaction needs one dedicated connection from the pool
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const groupResult = await client.query(
            'INSERT INTO groups (name, owner_id) VALUES ($1, $2) RETURNING *',
            [name, ownerId]
        )
        const group = groupResult.rows[0]

        // owner is a member right away, no join request needed
        await client.query(
            "INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'accepted')",
            [group.id, ownerId]
        )

        await client.query('COMMIT')
        return group
    } catch (error) {
        // undo everything done in this transaction
        await client.query('ROLLBACK')
        throw error
    } finally {
        // always return the connection to the pool
        client.release()
    }
}

// get all groups with owner's username, sorted by name
export async function getAllGroups() {
    const result = await pool.query(
        `SELECT groups.id, groups.name, groups.owner_id, users.username AS owner_name
        FROM groups
        JOIN users ON groups.owner_id = users.id
        ORDER BY groups.name`
    )
    return result.rows
}

// get one group with owner's username
export async function getGroupById(groupId) {
    const result = await pool.query(
        `SELECT groups.id, groups.name, groups.owner_id, users.username AS owner_name
        FROM groups
        JOIN users ON groups.owner_id = users.id
        WHERE groups.id = $1`,
        [groupId]
    )
    return result.rows[0]
}
