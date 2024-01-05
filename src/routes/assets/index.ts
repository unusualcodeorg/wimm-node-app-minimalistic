import express from 'express';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import admin from './admin';
import { NotFoundError } from '../../core/ApiError';
import { checkFile } from '../../helpers/disk';
import { FileResponse } from '../../core/ApiResponse';
import notfound from '../notfound';

const router = express.Router();

router.use('/admin', admin, notfound);

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.VIEWER), authorization);
/*----------------------------------------------------------------*/

router.get(
  '/image/:image',
  validator(schema.image, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { exists, filepath } = checkFile(req.params.image);
    if (!exists) throw new NotFoundError('Image does not exist');
    new FileResponse(filepath).send(res);
  }),
);

export default router;
