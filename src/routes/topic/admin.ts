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
import Topic from '../../database/model/Topic';
import { Types } from 'mongoose';
import { BadRequestError } from '../../core/ApiError';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.topicCreate, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topic = {
      name: req.body.name,
      title: req.body.title,
      thumbnail: req.body.thumbnail,
      description: req.body.description,
      coverImgUrl: req.body.coverImgUrl,
      createdBy: req.user,
      updatedBy: req.user
    } as Topic;
    
    if(req.body.score) topic.score = req.body.score;
    
    const created = await TopicRepo.create(topic);
    new SuccessResponse('Success', created).send(res);
  }),
);

router.put(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  validator(schema.topicUpdate, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topic = await TopicRepo.findById(new Types.ObjectId(req.params.id));
    if(!topic) throw new BadRequestError('Topic does not exists')

    if(req.body.name) topic.name = req.body.name;
    if (req.body.title) topic.title = req.body.title;
    if (req.body.thumbnail) topic.thumbnail = req.body.thumbnail;
    if (req.body.description) topic.description = req.body.description;
    if (req.body.coverImgUrl) topic.coverImgUrl = req.body.coverImgUrl;
    if (req.body.score) topic.score = req.body.score;
    
    topic.createdBy = req.user
    const updated = await TopicRepo.update(topic)
    new SuccessResponse('Success', updated).send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topic = await TopicRepo.findById(new Types.ObjectId(req.params.id));
    if (!topic) throw new BadRequestError('Topic does not exists');
   
    const removed = await TopicRepo.remove(topic);

    new SuccessResponse('Success', removed).send(res);
  }),
);

export default router;
