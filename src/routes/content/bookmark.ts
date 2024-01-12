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
import ContentRepo from '../../database/repository/ContentRepo';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import BookmarkRepo from '../../database/repository/BookmarkRepo';
import Bookmark from '../../database/model/Bookmark';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.contentId),
    );
    if (!content) throw new NotFoundError('Content Not Found');

    if (!content.createdBy._id.equals(req.user._id)) {
      const bookmark = await BookmarkRepo.findBookmark(req.user, content);
      if (!bookmark) {
        await BookmarkRepo.create({
          user: req.user,
          content: content,
        } as Bookmark);
      }
    }

    new SuccessMsgResponse('Content bookmarked successfully').send(res);
  }),
);

router.delete(
  '/id/:contentId',
  validator(schema.contentId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.params.contentId),
    );
    if (!content) throw new NotFoundError('Content Not Found');

    const bookmark = await BookmarkRepo.findBookmark(req.user, content);
    if (!bookmark) throw new NotFoundError('Bookmark Not Found');

    await BookmarkRepo.remove(bookmark);
    new SuccessMsgResponse('Content bookmark removed successfully').send(res);
  }),
);

export default router;
