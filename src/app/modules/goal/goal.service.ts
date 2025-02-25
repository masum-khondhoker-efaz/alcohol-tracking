import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createGoalIntoDb = async (
  userId: string,
  data: {
    challengeId: string;
  },
) => {
  // Check if there is any pending goal for the user
  const pendingGoal = await prisma.goal.findFirst({
    where: {
      userId: userId,
      status: 'PENDING',
    },
  });

  if (pendingGoal) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have a pending goal. Complete it before adding a new one.',
    );
  }

  // Check if the user has completed all challenges
  const completedChallenges = await prisma.goal.findMany({
    where: {
      userId: userId,
      status: 'COMPLETED',
    },
  });

  const allChallenges = await prisma.challenge.findMany();

  if (completedChallenges.length === allChallenges.length) {
    // User has completed all challenges, allow adding the challenge again
    const result = await prisma.goal.create({
      data: {
        challengeId: data.challengeId,
        userId: userId,
      },
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'goal not created');
    }

    return result;
  }

  // Check if the challengeId is already used in a goal for the user
  const existingGoal = await prisma.goal.findFirst({
    where: {
      userId: userId,
      challengeId: data.challengeId,
    },
  });

  if (existingGoal) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This challenge is already added as a goal for this user.',
    );
  }

  // Create a new goal
  const result = await prisma.goal.create({
    data: {
      challengeId: data.challengeId,
      userId: userId,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'goal not created');
  }

  return result;
};

const getGoalListFromDb = async (userId: string) => {
  const challenges = await prisma.challenge.findMany();
  if (challenges.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No challenges found');
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId: userId,
    },
  });

  const challengeList = challenges.map(challenge => {
    const userGoal = goals.find(goal => goal.challengeId === challenge.id);
    return {
      ...challenge,
      status: userGoal ? userGoal.status : 'NOT_TAKEN',
    };
  });

  return challengeList;
};

const getGoalByIdFromDb = async (goalId: string) => {
  const result = await prisma.goal.findUnique({
    where: {
      id: goalId,
    },
    include: {
      challenge: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'goal not found');
  }
  return result;
};

const updateGoalIntoDb = async (userId: string, goalId: string, data: any) => {
  const result = await prisma.goal.update({
    where: {
      id: goalId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'goalId, not updated');
  }
  return result;
};

const deleteGoalItemFromDb = async (userId: string, goalId: string) => {
  const deletedItem = await prisma.goal.delete({
    where: {
      id: goalId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'goalId, not deleted');
  }

  return deletedItem;
};

export const goalService = {
  createGoalIntoDb,
  getGoalListFromDb,
  getGoalByIdFromDb,
  updateGoalIntoDb,
  deleteGoalItemFromDb,
};
