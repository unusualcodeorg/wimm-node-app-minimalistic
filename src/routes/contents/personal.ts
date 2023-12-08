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
import ContentRepo from '../../database/repository/ContentRepo';
import BookmarkRepo from '../../database/repository/BookmarkRepo';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.VIEWER), authorization);
//----------------------------------------------------------------

router.get(
  '/',
  validator(schema.pagination, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const contents = await ContentRepo.findUserContentsPaginated(
      req.user,
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );
    new SuccessResponse('Success', contents).send(res);
  }),
);

router.get(
  '/box',
  validator(schema.pagination, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const bookmarks = await BookmarkRepo.findBookmarks(req.user);
    const contents = await ContentRepo.findUserBoxContentPaginated(
      req.user,
      bookmarks.map((bookmark) => bookmark.content._id),
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );
    new SuccessResponse('Success', contents).send(res);
  }),
);

export default router;
