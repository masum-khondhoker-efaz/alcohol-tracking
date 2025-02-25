import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { blogController } from './blog.controller';
import { blogValidation } from './blog.validation';
import { UserRoleEnum } from '@prisma/client';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/parseBody';
import { updateMulterUpload } from '../../utils/updateMulterUpload';

const router = express.Router();

router.post(
  '/',
  multerUpload.single('blogImage'),
  parseBody,
  validateRequest(blogValidation.createSchema),
  auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  blogController.createBlog,
);

router.get('/', auth(), blogController.getBlogList);

router.get('/:blogId', auth(), blogController.getBlogById);

router.put(
  '/:blogId',
  updateMulterUpload.single('blogImage'),
  parseBody,
  validateRequest(blogValidation.updateSchema),
  auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  blogController.updateBlog,
);

router.delete(
  '/:blogId',
  auth(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  blogController.deleteBlog,
);

export const blogRoutes = router;