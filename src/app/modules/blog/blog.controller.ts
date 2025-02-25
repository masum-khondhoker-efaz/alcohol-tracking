import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { blogService } from './blog.service';
import AppError from '../../errors/AppError';
import { uploadFileToSpace } from '../../utils/multerUpload';
import { uploadFileToSpaceForUpdate } from '../../utils/updateMulterUpload';

const createBlog = catchAsync(async (req, res) => {
   const user = req.user as any;
   const data = req.body;
   const file = req.file;

   if (!file) {
     throw new AppError(httpStatus.CONFLICT, 'file not found');
   }
   const fileUrl = await uploadFileToSpace(file, 'retire-professional');

   const blogData = {
     data,
     blogImage: fileUrl,
   };
  const result = await blogService.createBlogIntoDb(user.id, blogData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getBlogList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await blogService.getBlogListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog list retrieved successfully',
    data: result,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await blogService.getBlogByIdFromDb(user.id, req.params.blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog details retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
 const blogId = req.params.blogId;
 const user = req.user as any;
 const data = req.body;
 const file = req.file;

 let blogData: { data: any; blogImage?: string } = { data };

 if (file) {
   const fileUrl = await uploadFileToSpaceForUpdate(
     file,
     'retire-professional',
   );
   blogData.blogImage = fileUrl;
 }
  const result = await blogService.updateBlogIntoDb(user.id, blogId, blogData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await blogService.deleteBlogItemFromDb(
    user.id,
    req.params.blogId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const blogController = {
  createBlog,
  getBlogList,
  getBlogById,
  updateBlog,
  deleteBlog,
};
