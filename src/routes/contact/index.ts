import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import MessageRepo from '../../database/repository/MessageRepo';
import Message from '../../database/model/Message';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.VIEWER), authorization);
//----------------------------------------------------------------

router.post(
  '/',
  validator(schema.message, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    await MessageRepo.create({
      type: req.body.type,
      user: req.user,
      message: req.body.message,
      deviceId: req.user.deviceId,
    } as Message);

    new SuccessMsgResponse('Thanks! We got your message.').send(res);
  }),
);

export default router;
