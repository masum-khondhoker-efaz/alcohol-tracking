import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { date } from 'zod';


const createDrinkUnitsIntoDb = async (userId: string, data: any) => {
  
   const existingUnits = await prisma.drinkUnits.findFirst({
   where: {
     userId: userId,
     date: new Date(data.date),
   },
   });

   if (existingUnits) {
   const updatedUnits = await prisma.drinkUnits.update({
     where: {
     id: existingUnits.id,
     },
     data: {
     totalUnits: existingUnits.totalUnits + data.units,
     },
   });
   return updatedUnits;
   } else {
   const newUnits = await prisma.drinkUnits.create({
     data: {
     ...data,
     date: new Date(data.date),
     userId: userId,
     totalUnits: data.units,
     },
   });
   return newUnits;
   }
};


const getDrinkUnitsListFromDb = async () => {
  
    const result = await prisma.drinkUnits.findMany();
    if (result.length === 0) {
    return { message: 'No drinkUnits found' };
  }
    return result;
};


const getDrinkUnitsByIdFromDb = async (drinkUnitsId: string) => {
  
    const result = await prisma.drinkUnits.findUnique({ 
    where: {
      id: drinkUnitsId,
    }
   });
    if (!result) {
    throw new AppError(httpStatus.NOT_FOUND,'drinkUnits not found');
  }
    return result;
  };


const updateDrinkUnitsIntoDb = async (userId: string, drinkUnitsId: string, data: any) => {
  
    const result = await prisma.drinkUnits.update({
      where:  {
        id: drinkUnitsId,
        userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'drinkUnitsId, not updated');
  }
    return result;
};


const deleteDrinkUnitsItemFromDb = async (userId: string, drinkUnitsId: string) => {
    const deletedItem = await prisma.drinkUnits.delete({
      where: {
      id: drinkUnitsId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'drinkUnitsId, not deleted');
  }

    return deletedItem;
};

export const drinkUnitsService = {
createDrinkUnitsIntoDb,
getDrinkUnitsListFromDb,
getDrinkUnitsByIdFromDb,
updateDrinkUnitsIntoDb,
deleteDrinkUnitsItemFromDb,
};