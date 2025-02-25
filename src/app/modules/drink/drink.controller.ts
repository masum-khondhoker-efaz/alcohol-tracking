import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { drinkService } from './drink.service';

const createDrink = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkService.createDrinkIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Drink created successfully',
    data: result,
  });
});

const getDrinkList = catchAsync(async (req, res) => {
  const date = req.params.date;
  const user = req.user as any;
  const result = await drinkService.getDrinkListFromDb(user.id, date);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drink list retrieved successfully',
    data: result,
  });
});

const getDrinkById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkService.getDrinkByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drink details retrieved successfully',
    data: result,
  });
});

const updateDrink = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkService.updateDrinkIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drink updated successfully',
    data: result,
  });
});

const deleteDrink = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkService.deleteDrinkItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drink deleted successfully',
    data: result,
  });
});

const getAllDrinkList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await drinkService.getDrinkListsByTypeFromDb(user.id, req.params.date);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drink list retrieved successfully',
    data: result,
  });
});


export const drinkController = {
  createDrink,
  getDrinkList,
  getDrinkById,
  updateDrink,
  deleteDrink,
  getAllDrinkList,
};