import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { NotFoundError } from '../../core/ApiError';

const router = express.Router();

router.use(
  asyncHandler(async () => {
    throw new NotFoundError();
  }),
);

export default router;
