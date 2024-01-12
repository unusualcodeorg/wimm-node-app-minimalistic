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
import Content, { Category } from '../../database/model/Content';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../core/ApiError';
import { Types } from 'mongoose';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.contentCreate, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    if (
      (req.body.extra.includes('https://youtu.be') ||
        req.body.extra.includes('https://www.youtube.com/watch')) &&
      req.body.category != Category.YOUTUBE
    ) {
      throw new BadRequestError('wrong content category sent');
    }

    const content = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      thumbnail: req.body.thumbnail,
      extra: req.body.extra,
      createdBy: req.user,
      updatedBy: req.user,
    } as Content;

    if (req.body.description) content.description = req.body.description;

    const created = await ContentRepo.create(content);

    new SuccessResponse('Content created successfully', {
      _id: created._id,
      category: created.category,
      title: created.title,
      subtitle: created.subtitle,
      thumbnail: created.thumbnail,
      extra: created.extra,
      submit: created.submit,
      private: created.private,
      createdBy: { _id: created.createdBy._id },
    }).send(res);
  }),
);

router.put(
  '/submit',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findPrivateInfoById(
      new Types.ObjectId(req.body.contentId),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    if (!req.user._id.equals(content.createdBy._id))
      throw new ForbiddenError('Permission denied');

    await ContentRepo.update({
      _id: content._id,
      submit: true,
    } as Content);

    new SuccessMsgResponse('Content submitted successfully').send(res);
  }),
);

router.put(
  '/unsubmit',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findPrivateInfoById(
      new Types.ObjectId(req.body.contentId),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    if (!req.user._id.equals(content.createdBy._id))
      throw new ForbiddenError('Permission denied');

    await ContentRepo.update({
      _id: content._id,
      submit: false,
    } as Content);

    new SuccessMsgResponse('Content submitted successfully').send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.contentId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.params.id),
    );
    if (!content) throw new NotFoundError('Content do not exists');

    if (!req.user._id.equals(content.createdBy._id))
      throw new ForbiddenError('Permission denied');

    await ContentRepo.update({
      _id: content._id,
      status: false,
    } as Content);

    new SuccessMsgResponse('Content deleted successfully').send(res);
  }),
);

export default router;
