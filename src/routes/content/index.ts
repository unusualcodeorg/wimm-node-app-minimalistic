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
import ContentRepo from '../../database/repository/ContentRepo';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import { statsBoostUp } from './utils';
import Content from '../../database/model/Content';
import bookmark from './bookmark';
import personal from './personal';
import admin from './admin';
import notfound from '../notfound';

const router = express.Router();

router.use('/bookmark', bookmark, notfound);
router.use('/private', personal, notfound);
router.use('/admin', admin, notfound);

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findPublicInfoById(
      new Types.ObjectId(req.params.id),
    );
    if (!content) throw new NotFoundError('Content Not Found');

    const likedContent = await ContentRepo.findUserAndContentLike(
      req.user,
      content,
    );

    content.liked = likedContent ? true : false;
    new SuccessResponse('Success', statsBoostUp(content)).send(res);
  }),
);

router.post(
  '/mark/view',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.id),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    if (!content.views) content.views = 0;

    await ContentRepo.update({
      _id: content._id,
      views: content.views + 1,
    } as Content);

    new SuccessMsgResponse('Content view marked successfully.').send(res);
  }),
);

router.post(
  '/mark/like',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.id),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    const likedContent = await ContentRepo.findUserAndContentLike(
      req.user,
      content,
    );

    if (!content.likes) content.likes = 0;

    if (!likedContent) {
      await ContentRepo.addLikeForUser(content, req.user, content.likes + 1);
    }

    new SuccessMsgResponse('Liked successfully.').send(res);
  }),
);

router.post(
  '/mark/unlike',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.id),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    const likedContent = await ContentRepo.findUserAndContentLike(
      req.user,
      content,
    );

    if (likedContent) {
      await ContentRepo.removeLikeForUser(content, req.user, content.likes - 1);
    }

    new SuccessMsgResponse('Like removed successfully.').send(res);
  }),
);

router.post(
  '/mark/share',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.id),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    await ContentRepo.update({
      _id: content._id,
      shares: content.shares + 1,
    } as Content);

    new SuccessMsgResponse('Content share marked successfully.').send(res);
  }),
);

export default router;
