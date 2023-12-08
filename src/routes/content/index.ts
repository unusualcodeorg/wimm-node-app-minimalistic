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
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import { statsBoostUp } from './utils';
import bookmark from './bookmark';

const router = express.Router();

router.use('/bookmark', bookmark);

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/similar/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findPublicInfoById(
      new Types.ObjectId(req.params.id),
    );
    if (!content) throw new NotFoundError('Content Not Found');

    const contents = await ContentRepo.searchSimilar(
      content,
      `${content.title} ${content.subtitle}`,
      10,
    );

    if (contents.length > 0) {
      const likedContents = await ContentRepo.findUserAndContentsLike(
        req.user,
        contents.map((c) => c._id),
      );

      for (const cnt of contents) {
        const found = likedContents.find((c) => c._id.equals(cnt._id));
        cnt.liked = found ? true : false;
        statsBoostUp(cnt);
      }
    }

    new SuccessResponse('Success', contents).send(res);
  }),
);

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

export default router;
