import express from 'express';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import User from '../../database/model/User';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import manager from './manager';
import admin from './admin';
import role from '../../helpers/role';
import { RoleCode } from '../../database/model/Role';
import authorization from '../../auth/authorization';
import notfound from '../notfound';

const router = express.Router();

router.use('/send', manager, notfound);
router.use('/admin', admin, notfound);

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.VIEWER), authorization);
//----------------------------------------------------------------

router.put(
  '/register',
  validator(schema.notificationRegister),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    await UserRepo.updateInfo({
      _id: user._id,
      firebaseFcmToken: req.body.firebaseFcmToken,
    } as User);
    return new SuccessMsgResponse('Registration updated for notification').send(res);
  }),
);

export default router;
