import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import AppError from '../../errors/AppError';
import { generateToken } from '../../utils/generateToken';
import prisma from '../../utils/prisma';
import { UserStatus } from '@prisma/client';
import { stat } from 'fs';

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
  fcmToken?: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });


  if(userData.status === UserStatus.INACTIVE){
    throw new AppError(httpStatus.CONFLICT, 'User is inactive');
  }

  const isCorrectPassword: Boolean = await bcrypt.compare(
    payload.password,
    userData.password!,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password incorrect');
  }

  const accessToken = await generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string,
  );

  if (payload.fcmToken) {
    await prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }

  return {
    id: userData.id,
    name: userData.fullName,
    email: userData.email,
    status: userData.status,
    role: userData.role,
    accessToken: accessToken,
  };
};

export const AuthServices = { loginUserFromDB };
