import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createBlogIntoDb = async (userId: string, blogData: any) => {
  const { data, blogImage } = blogData;
  const result = await prisma.blog.create({
    data: {
      ...data,
      image: blogImage,
      userId: userId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not created');
  }

  return result;
};

const getBlogListFromDb = async () => {
  const result = await prisma.blog.findMany();
  if (result.length === 0) {
    return { message: 'No blog found' };
  }
  return result;
};

const getBlogByIdFromDb = async (userId: string, blogId: string) => {
  const result = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND,'Blog not found');
  }
  return result;
};

const updateBlogIntoDb = async (
  userId: string,
  blogId: string,
  blogData: any,
) => {
  const { data, blogImage } = blogData;
  const result = await prisma.blog.update({
    where: {
      id: blogId,
      userId: userId,
    },
    data: {
      ...data,
      image: blogImage,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not updated');
  }
  return result;
};

const deleteBlogItemFromDb = async (userId: string, blogId: string) => {
  const deletedItem = await prisma.blog.delete({
    where: {
      id: blogId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not deleted');
  }

  return deletedItem;
};

export const blogService = {
  createBlogIntoDb,
  getBlogListFromDb,
  getBlogByIdFromDb,
  updateBlogIntoDb,
  deleteBlogItemFromDb,
};
