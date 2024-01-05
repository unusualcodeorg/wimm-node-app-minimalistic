import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import UserRepo from '../../database/repository/UserRepo';
import User from '../../database/model/User';
import { NotFoundError } from '../../core/ApiError';
import _ from 'lodash';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new NotFoundError('User not registered');

    return new SuccessResponse(
      'success',
      _.pick(user, ['name', 'email', 'profilePicUrl', 'roles']),
    ).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const userinfo = { _id: req.user._id } as User;

    if (req.body.name) userinfo.name = req.body.name;
    if (req.body.profilePicUrl) userinfo.profilePicUrl = req.body.profilePicUrl;
    if (req.body.tagline) userinfo.tagline = req.body.tagline;

    await UserRepo.updateInfo(userinfo);

    new SuccessMsgResponse('User info updated successfully').send(res);
  }),
);

export default router;
