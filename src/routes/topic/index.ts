import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import TopicRepo from '../../database/repository/TopicRepo';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import admin from './admin';
import notfound from '../notfound';

const router = express.Router();

router.use('/admin', admin, notfound);

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*-------------------------------------------------------------------------*/

router.get(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topic = await TopicRepo.findById(new Types.ObjectId(req.params.id));
    if (!topic) throw new NotFoundError('Topic not found');
    new SuccessResponse('Success', topic).send(res);
  }),
);

export default router;
