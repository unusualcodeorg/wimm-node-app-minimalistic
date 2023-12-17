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
import admin from './admin'

const router = express.Router();

router.use('/admin', admin)

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/asset',
  validator(schema.asset, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    new SuccessResponse('Success', {}).send(res);
  }),
);

export default router;
