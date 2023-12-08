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
import { scrapMetadata } from '../../helpers/scrapper';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.VIEWER), authorization);
//----------------------------------------------------------------

router.get(
  '/content',
  validator(schema.url, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const metadata = await scrapMetadata(req.query.url as string);
    new SuccessResponse('Success', metadata).send(res);
  }),
);

export default router;
