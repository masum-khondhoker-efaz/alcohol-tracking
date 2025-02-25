import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';


const createChallengeIntoDb = async (userId: string, data: any) => {
  
    const result = await prisma.challenge.create({ 
    data: {
      ...data,
      userId: userId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'challenge not created');
  }
    return result;
};

const getChallengeListFromDb = async () => {
  
    const result = await prisma.challenge.findMany();
    if (result.length === 0) {
    return { message: 'No challenge found' };
  }
    return result;
};

const getChallengeByIdFromDb = async (challengeId: string) => {
  
    const result = await prisma.challenge.findUnique({ 
    where: {
      id: challengeId,
    }
   });
    if (!result) {
    throw new AppError(httpStatus.NOT_FOUND,'challenge not found');
  }
    return result;
  };



const updateChallengeIntoDb = async (userId: string, challengeId: string, data: any) => {
  
    const result = await prisma.challenge.update({
      where:  {
        id: challengeId,
        userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'challengeId, not updated');
  }
    return result;
  };

const deleteChallengeItemFromDb = async (userId: string, challengeId: string) => {
    const deletedItem = await prisma.challenge.delete({
      where: {
      id: challengeId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'challengeId, not deleted');
  }

    return deletedItem;
  };

export const challengeService = {
createChallengeIntoDb,
getChallengeListFromDb,
getChallengeByIdFromDb,
updateChallengeIntoDb,
deleteChallengeItemFromDb,
};