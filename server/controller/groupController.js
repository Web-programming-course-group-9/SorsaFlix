import { deleteGroup, addJoinRequest, createGroup, getAllGroups } from '../models/groupModel.js'

// delete group
export async function removeGroup(req, res, next) {
    try {
        // logged in user from token
        const userId = req.user.id
        // group id from URL
        const groupId = Number(req.params.groupId)


        // check that id is a positive integer
        if (groupId < 1 || !Number.isInteger(groupId)) {
            return res.status(400).json({ error: 'Invalid group ID' })
        }

        // delete only if owner, otherwise nothing is deleted and we return 404
        const group = await deleteGroup(groupId, userId)

        // nothing deleted: group does not exist or user is not the owner
        if (!group) {
            return res.status(404).json({ error: 'Group not found or you are not the owner' })
        }

        res.sendStatus(204) // No Content
    } catch (error) {
        // pass unexpected errors to error handler
        next(error)
    }
}

// sedn join request
export async function sendJoinRequest(req, res, next) {
    try {
        const userId = req.user.id
        const groupId = Number(req.params.groupId)

        if (groupId < 1 || !Number.isInteger(groupId)) {
            return res.status(400).json({ error: 'Invalid group ID' })
        }

        // status 'pending' by default
        const request = await addJoinRequest(groupId, userId)

        res.status(201).json(request) // Created
    } catch (error) {
        // Unique violation error: user has already sent a join request or is already a member
        if (error.code === '23505') {
            return res.status(409).json({ error: 'You have already sent a join request or are already a member' })
        }
        // Foreign key violation: group does not exist
        if (error.code === '23503') {
            return res.status(404).json({ error: 'Group not found' })
        }
        next(error)
    }
}

// create group, logged in as user becomes owner
export async function addGroup(req, res, next) {
    try {
        //logged in user from token
        const userId = req.user.id
        //group name from request body
        const { name } = req.body

        //name must be text
        if (typeof name !== 'string') {
            return res.status(400).json({ error: 'Group name is required' })
        }

        //remove spaces from start and end
        const trimmedName = name.trim()

        //name can't be empty or longer than the database allows (varchar 50)
        if (trimmedName.length === 0 || trimmedName.length > 50) {
            return res.status(400).json({ error: 'Group name must be 1-50 characters' })
        }

        const group = await createGroup(trimmedName, userId)

        res.status(201).json(group) // Created
    } catch (error) {
        // pass unexpected errors to error handler
        next(error)
    }
}

// list all groups
export async function listGroups(req, res, next) {
    try {
        const groups = await getAllGroups()
        res.json(groups) // 200 OK by default
    } catch (error) {
        //pass unexpected errors to error handler
        next(error)
    }
}
