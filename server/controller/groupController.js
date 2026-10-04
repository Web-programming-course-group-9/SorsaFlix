import { deleteGroup, addJoinRequest, createGroup, getAllGroups, getGroupById, isGroupMember, getGroupMovies, isGroupOwner, getPendingRequests, acceptJoinRequest, rejectJoinRequest, removeMember, getGroupMembers } from '../models/groupModel.js'

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

// get group details, movies and members
export async function getGroup(req, res, next) {
  try {
    const groupId = Number(req.params.id)
    const userId = req.user.id

    const group = await getGroupById(groupId)

    if (!group) {
      return res.status(404).json({
        error: "Group not found"
      })
    }

    const member = await isGroupMember(
      groupId,
      userId
    )

    if (!member) {
      return res.status(403).json({
        error: "You are not a member of this group"
      })
    }

    const movies = await getGroupMovies(groupId)
    const members = await getGroupMembers(groupId)

    res.status(200).json({
      ...group,
      movies,
      members    
    })
  } catch (error) {
    next(error)
  }
}

// get pending join requests for a group
export async function getPendingGroupRequests(
  req,
  res,
  next
) {
  try {
    const groupId = Number(req.params.id)
    const userId = req.user.id

    const owner = await isGroupOwner(
      groupId,
      userId
    )

    if (!owner) {
      return res.status(403).json({
        error: "Only the group owner can view join requests"
      })
    }

    const requests = await getPendingRequests(
      groupId
    )

    res.status(200).json(requests)
  } catch (error) {
    next(error)
  }
}

// Accept a pending join request
export async function acceptGroupRequest(
  req,
  res,
  next
) {
  try {
    const groupId = Number(req.params.id)
    const requestId = Number(req.params.requestId)
    const userId = req.user.id

    const owner = await isGroupOwner(
      groupId,
      userId
    )

    if (!owner) {
      return res.status(403).json({
        error: "Only the group owner can accept join requests"
      })
    }

    const request = await acceptJoinRequest(
      requestId,
      groupId
    )

    if (!request) {
      return res.status(404).json({
        error: "Join request not found"
      })
    }

    res.status(200).json(request)
  } catch (error) {
    next(error)
  }
}

// Reject a pending join request
export async function rejectGroupRequest(
  req,
  res,
  next
) {
  try {
    const groupId = Number(req.params.id)
    const requestId = Number(req.params.requestId)
    const userId = req.user.id

    const owner = await isGroupOwner(
      groupId,
      userId
    )

    if (!owner) {
      return res.status(403).json({
        error: "Only the group owner can reject join requests"
      })
    }

    const request = await rejectJoinRequest(
      requestId,
      groupId
    )

    if (!request) {
      return res.status(404).json({
        error: "Join request not found"
      })
    }

    res.status(200).json({
      message: "Join request rejected"
    })
  } catch (error) {
    next(error)
  }
}

// Remove a member: user can leave by themselves, or owner can remove others
export async function removeGroupMember(req, res, next) {
  try {
    const groupId = Number(req.params.groupId)
    // user to be removed, from URL
    const memberId = Number(req.params.memberId)
    // logged in user, from token
    const userId = req.user.id

    // both ids must be positive integers
    if (!Number.isInteger(groupId) || groupId < 1 ||
      !Number.isInteger(memberId) || memberId < 1) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const isSelf = memberId === userId
    const owner = await isGroupOwner(groupId, userId)

    // owner can't leave, otherwise the group would have no owner
    if (isSelf && owner) {
      return res.status(400).json({
        error: "Owner can't leave the group. Delete group instead."
      })
    }

    //others can only remove themselves
    if (!isSelf && !owner) {
      return res.status(403).json({
        error: "Only the group owner can remove other members"
      })
    }

    const removed = await removeMember(groupId, memberId)

    if (!removed) {
      return res.status(404).json({ error: "Member not found" })
    }

    res.sendStatus(204) // No Content
  } catch (error) {
    next(error)
  }
}