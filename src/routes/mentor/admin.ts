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
import { BadRequestError } from '../../core/ApiError';
import Mentor from '../../database/model/Mentor';
import MentorRepo from '../../database/repository/MentorRepo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.mentorCreate, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const mentor = {
      name: req.body.name,
      thumbnail: req.body.thumbnail,
      occupation: req.body.occupation,
      title: req.body.title,
      description: req.body.description,
      coverImgUrl: req.body.coverImgUrl,
      createdBy: req.user,
      updatedBy: req.user,
    } as Mentor;
    
    if(req.body.score) mentor.score = req.body.score;
    
    const created = await MentorRepo.create(mentor);
    new SuccessResponse('Success', created).send(res);
  }),
);

router.put(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  validator(schema.mentorUpdate, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const mentor = await MentorRepo.findById(new Types.ObjectId(req.params.id));
    if(!mentor) throw new BadRequestError('Mentor does not exists')

    if(req.body.name) mentor.name = req.body.name;
    if (req.body.thumbnail) mentor.thumbnail = req.body.thumbnail;
    if (req.body.occupation) mentor.occupation = req.body.occupation;
    if (req.body.title) mentor.title = req.body.title;
    if (req.body.description) mentor.description = req.body.description;
    if (req.body.coverImgUrl) mentor.coverImgUrl = req.body.coverImgUrl;
    if (req.body.score) mentor.score = req.body.score;
    mentor.updatedBy = req.user;

    const updated = await MentorRepo.update(mentor)
    new SuccessResponse('Success', updated).send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const topic = await MentorRepo.findById(new Types.ObjectId(req.params.id));
    if (!topic) throw new BadRequestError('Topic does not exists');
   
    const removed = await MentorRepo.remove(topic);
    new SuccessResponse('Success', removed).send(res);
  }),
);

export default router;
