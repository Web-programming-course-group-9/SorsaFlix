import { Router } from 'express'
import requireAuth from '../middleware/auth.js' // checks login token
import { removeGroup, sendJoinRequest, addGroup, listGroups } from '../controller/groupController.js'

const router = Router()

// delete group, only if user is the owner
router.delete('/:groupId', requireAuth, removeGroup)

// list all public groups
router.get('/', listGroups)

// create group
router.post('/', requireAuth, addGroup)

// send join request to group
router.post('/:groupId/join', requireAuth, sendJoinRequest)

export default router