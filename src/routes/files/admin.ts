import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import role from '../../helpers/role';
import authentication from '../../auth/authentication';
import authorization from '../../auth/authorization';
import { RoleCode } from '../../database/model/Role';
import { BadRequestError, InternalError } from '../../core/ApiError';
import { getBaseUrl } from '../../helpers/utils';
import { uploadImage } from '../../helpers/disk';

const router = express.Router();

/*----------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*----------------------------------------------------------------*/

router.post(
  '/public/image',
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const header = req.headers['content-type'];
    if (!header || !header.includes('multipart/form-data'))
      throw new BadRequestError(
        'header content-type should be multipart/form-data',
      );

    uploadImage()(req, res, async (err: any) => {
      try {
        if (err) throw new BadRequestError(err.message);

        if (!req.file) throw new InternalError('Something went wrong');

        new SuccessResponse('Image upload success', {
          url: `${getBaseUrl(req)}/files/image/${req.file?.filename}`,
        }).send(res);
      } catch (err) {
        next(err);
      }
    });
  }),
);

export default router;
