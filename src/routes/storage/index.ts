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
import Storage from '../../database/model/Storage';
import StorageRepo from '../../database/repository/StorageRepo';
import { Journal, Mood } from '../../types/model-types';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/moods',
  validator(schema.moods, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const storages = req.body.moods.map((mood: Mood) => {
      const storage = {
        id: mood.id,
        data1: 'MOOD',
        data2: mood.code,
        createdBy: req.user,
        updatedBy: req.user,
        createdAt: new Date(mood.createdAt),
        updatedAt: new Date(),
      } as Storage;
      return storage;
    });

    await StorageRepo.insertMany(storages);
    new SuccessMsgResponse('Moods stored successfully').send(res);
  }),
);

router.post(
  '/journals',
  validator(schema.journals, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const storages = req.body.moods.map((journal: Journal) => {
      const storage = {
        id: journal.id,
        data1: 'JOURNAL',
        data2: journal.text,
        createdBy: req.user,
        updatedBy: req.user,
        createdAt: new Date(journal.createdAt),
        updatedAt: new Date(),
      } as Storage;
      return storage;
    });

    await StorageRepo.insertMany(storages);
    new SuccessMsgResponse('Journals stored successfully').send(res);
  }),
);

export default router;
