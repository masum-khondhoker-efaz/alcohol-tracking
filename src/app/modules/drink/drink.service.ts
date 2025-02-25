import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createDrinkIntoDb = async (userId: string, data: any) => {
  const { dayType, date } = data;

  // Ensure the date is valid and properly formatted
  const entryDate = date ? new Date(date + 'T00:00:00Z') : new Date();
  if (isNaN(entryDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid date provided');
  }

  const startOfDay = entryDate;
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = entryDate;
  endOfDay.setHours(24, 0, 0, 0);

  const result = await prisma.$transaction(async transactionClient => {
    // Check if there is already a drink entry for the user on the same day
    const existingDrink = await transactionClient.drink.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingDrink) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'A drink entry already exists for this day',
      );
    }

    // Create a new drink entry
    const result = await transactionClient.drink.create({
      data: {
        dayType: dayType,
        date: entryDate,
        userId: userId,
      },
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Drink not created');
    }

    if (dayType === 'DRY_DAY') {
      // Fetch the most recent goal related to the user
      const goal = await transactionClient.goal.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: { challenge: true },
      });

      if (goal) {
      // Fetch the last DRY_DAY entries to check for consecutive days
      const lastDryDays = await transactionClient.drink.findMany({
        where: {
        userId: userId,
        dayType: 'DRY_DAY',
        },
        orderBy: {
        date: 'desc',
        },
        take: goal.challenge.count,
      });

      // Check if the DRY_DAY entries are consecutive
      const isConsecutive = lastDryDays.every((drink, index) => {
        if (index === 0) return true;
        const prevDate = new Date(lastDryDays[index - 1].date);
        const currDate = new Date(drink.date);
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);
        return (prevDate.getTime() - currDate.getTime()) === 86400000; // 1 day in milliseconds
      });

      // If the consecutive DRY_DAY count matches the challenge count, update the goal status to COMPLETED
      if (isConsecutive && lastDryDays.length === goal.challenge.count) {
        await transactionClient.goal.update({
        where: { id: goal.id },
        data: { status: 'COMPLETED' },
        });
      }
      }
    }

    return result;
  });

  return result;
};

const getDrinkListFromDb = async (userId: string, date: string) => {
  const now = new Date(date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(startOfYear);
  endOfYear.setFullYear(endOfYear.getFullYear() + 1);

  const [dayCount, weekCount, monthCount, yearCount, totalCount] =
    await prisma.$transaction([
      prisma.drink.count({
        where: {
          userId: userId,
          dayType: 'DRY_DAY',
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      }),
      prisma.drink.count({
        where: {
          userId: userId,
          dayType: 'DRY_DAY',
          createdAt: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
        },
      }),
      prisma.drink.count({
        where: {
          userId: userId,
          dayType: 'DRY_DAY',
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),
      prisma.drink.count({
        where: {
          userId: userId,
          dayType: 'DRY_DAY',
          createdAt: {
            gte: startOfYear,
            lt: endOfYear,
          },
        },
      }),
      prisma.drink.count({
        where: {
          userId: userId,
          dayType: 'DRY_DAY',
        },
      }),
    ]);

  return {
    dayCount,
    weekCount,
    monthCount,
    yearCount,
    totalCount,
  };
};

const getDrinkByIdFromDb = async (drinkId: string) => {
  const result = await prisma.drink.findUnique({
    where: {
      id: drinkId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'drink not found');
  }
  return result;
};


const updateDrinkIntoDb = async (
  userId: string,
  drinkId: string,
  data: any,
) => {
  const { dayType } = data;

  const result = await prisma.$transaction(async transactionClient => {
    // Update the drink entry
    const result = await transactionClient.drink.update({
      where: {
        id: drinkId,
        userId: userId,
      },
      data: {
        ...data,
      },
    });

    // If drink update fails, throw an error
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'drinkId, not updated');
    }

    // If the dayType is DRY_DAY, check and update the goal status
    if (dayType === 'DRY_DAY') {
      // Fetch the goal related to the user
      const goal = await transactionClient.goal.findFirst({
        where: { userId: userId },
        include: { challenge: true },
      });

      if (goal) {
        // Fetch the last DRY_DAY entries to check for consecutive days
        const lastDryDays = await transactionClient.drink.findMany({
          where: {
            userId: userId,
            dayType: 'DRY_DAY',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: goal.challenge.count,
        });

        // Check if the DRY_DAY entries are consecutive
        const isConsecutive = lastDryDays.every((drink, index) => {
          if (index === 0) return true;
          const prevDate = new Date(lastDryDays[index - 1].createdAt);
          const currDate = new Date(drink.createdAt);
          return prevDate.getDate() - currDate.getDate() === 1;
        });

        // If the consecutive DRY_DAY count matches the challenge count, update the goal status to COMPLETED
        if (isConsecutive && lastDryDays.length === goal.challenge.count) {
          await transactionClient.goal.update({
            where: { id: goal.id },
            data: { status: 'COMPLETED' },
          });
        }
      }
    }

    // Return the result of the drink update
    return result;
  });
};


const deleteDrinkItemFromDb = async (userId: string, drinkId: string) => {
  const deletedItem = await prisma.drink.delete({
    where: {
      id: drinkId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'drinkId, not deleted');
  }

  return deletedItem;
};


const getDrinkListsByTypeFromDb = async (userId: string, date: string) => {
  const now = new Date(date);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [dryDays, alcoholDays] = await prisma.$transaction([
    prisma.drink.findMany({
      where: {
        userId: userId,
        dayType: 'DRY_DAY',
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.drinkUnits.findMany({
      where: {
        userId: userId,
        dayType: 'ALCOHOL_DAY',
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      select: {
        id: true,
        userId: true,
        dayType: true,
        createdAt: true,
        updatedAt: true,
        totalUnits: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    dryDays,
    alcoholDays,
  };
};


export const drinkService = {
  createDrinkIntoDb,
  getDrinkListFromDb,
  getDrinkByIdFromDb,
  updateDrinkIntoDb,
  deleteDrinkItemFromDb,
  getDrinkListsByTypeFromDb,
};
