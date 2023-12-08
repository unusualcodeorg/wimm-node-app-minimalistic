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
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import MentorRepo from '../../database/repository/MentorRepo';
import ContentRepo from '../../database/repository/ContentRepo';
import TopicRepo from '../../database/repository/TopicRepo';
import Content from '../../database/model/Content';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.get(
  '/id/:id',
  validator(schema.contentId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.params.contentId),
    );
    if (!content) throw new NotFoundError('content do not exists');
    new SuccessResponse('Success', content).send(res);
  }),
);

router.post(
  '/',
  validator(schema.contentAdminCreate, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      thumbnail: req.body.thumbnail,
      extra: req.body.extra,
      createdBy: req.user,
      updatedBy: req.user,
      score: req.body.score ? req.body.score : 0,
      private: false,
    } as Content;

    if (req.body.topicId) {
      const topic = await TopicRepo.findById(
        new Types.ObjectId(req.body.topicId),
      );
      if (!topic) throw new NotFoundError('Topic do not exists');
      content.topics = [topic];
    }

    if (req.body.mentorId) {
      const mentor = await MentorRepo.findById(
        new Types.ObjectId(req.body.mentorId),
      );
      if (!mentor) throw new NotFoundError('Mentor do not exists');
      content.mentors = [mentor];
    }

    if (!content.topics && !content.mentors) {
      throw new BadRequestError(
        'Content must have atleast a mentor or a topic',
      );
    }

    const created = await ContentRepo.create(content);
    new SuccessResponse('Content created successfully', created).send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.contentId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.params.contentId),
    );
    if (!content) throw new NotFoundError('content do not exists');

    const updated = await ContentRepo.update({
      _id: content._id,
      status: false,
    } as Content);

    new SuccessResponse('Content deleted successfully', updated).send(res);
  }),
);

router.post(
  '/publish/general',
  validator(schema.contentId, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const content = await ContentRepo.findById(
      new Types.ObjectId(req.body.contentId),
    );
    if (!content) throw new NotFoundError('content do not exists');

    const updated = await ContentRepo.update({
      _id: content._id,
      general: true,
      private: false,
      updatedAt: new Date(),
    } as Content);

    new SuccessResponse('Content published successfully', updated).send(res);
  }),
);

export default router;
