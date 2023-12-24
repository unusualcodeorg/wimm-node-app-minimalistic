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
import { Category } from '../../database/model/Content';
import { UniversalSearchResult } from '../../types/client-types';
import { search, searchMentors, searchTopics } from './utils';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/',
  validator(schema.searchKey, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const query = req.query.query as string;
    let data: UniversalSearchResult[] = [];
    if (req.query.filter) {
      switch (req.query.filter as string) {
        case Category.MENTOR_INFO: {
          data = await searchMentors(query);
          break;
        }
        case Category.TOPIC_INFO: {
          data = await searchTopics(query);
          break;
        }
      }
    } else {
      data = await search(query);
    }

    new SuccessResponse('Success', data).send(res);
  }),
);

export default router;
