import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { drinkUnitsService } from './drinkUnits.service';

const createDrinkUnits = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkUnitsService.createDrinkUnitsIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'DrinkUnits created successfully',
    data: result,
  });
});

const getDrinkUnitsList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkUnitsService.getDrinkUnitsListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DrinkUnits list retrieved successfully',
    data: result,
  });
});

const getDrinkUnitsById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkUnitsService.getDrinkUnitsByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DrinkUnits details retrieved successfully',
    data: result,
  });
});

const updateDrinkUnits = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkUnitsService.updateDrinkUnitsIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DrinkUnits updated successfully',
    data: result,
  });
});

const deleteDrinkUnits = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkUnitsService.deleteDrinkUnitsItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DrinkUnits deleted successfully',
    data: result,
  });
});

export const drinkUnitsController = {
  createDrinkUnits,
  getDrinkUnitsList,
  getDrinkUnitsById,
  updateDrinkUnits,
  deleteDrinkUnits,
};