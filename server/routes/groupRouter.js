import { Router } from 'express'
import requireAuth from '../middleware/auth.js' // checks login token
import { removeGroup, sendJoinRequest,getGroup,getPendingGroupRequests,acceptGroupRequest,rejectGroupRequest} from '../controller/groupController.js'

const router = Router()

// delete group, only if user is the owner
router.delete('/:groupId', requireAuth, removeGroup)

// send join request to group
router.post('/:groupId/join', requireAuth, sendJoinRequest)

// get group details and movies requireAuth
router.get("/:id",requireAuth,getGroup)

// get pending join requests for a group
router.get("/:id/requests",requireAuth,getPendingGroupRequests)

// accept a pending join request
router.patch("/:id/requests/:requestId/accept", requireAuth,acceptGroupRequest)

// reject a pending join request
router.delete("/:id/requests/:requestId",requireAuth,rejectGroupRequest)

export default router