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

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.VIEWER), authorization);
//----------------------------------------------------------------

router.get(
  '/latest',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topics = await TopicRepo.findTopicsPaginated(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );
    new SuccessResponse('Success', topics).send(res);
  }),
);

router.get(
  '/recommendation',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topics = await TopicRepo.findRecommendedTopicsPaginated(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );
    new SuccessResponse('Success', topics).send(res);
  }),
);

export default router;
