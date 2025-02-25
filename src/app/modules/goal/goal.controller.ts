import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { goalService } from './goal.service';

const createGoal = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await goalService.createGoalIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Goal created successfully',
    data: result,
  });
});

const getGoalList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await goalService.getGoalListFromDb(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal list retrieved successfully',
    data: result,
  });
});

const getGoalById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await goalService.getGoalByIdFromDb(req.params.goalId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal details retrieved successfully',
    data: result,
  });
});

const updateGoal = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await goalService.updateGoalIntoDb(
    user.id,
    req.params.goalId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal updated successfully',
    data: result,
  });
});

const deleteGoal = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await goalService.deleteGoalItemFromDb(
    user.id,
    req.params.goalId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal deleted successfully',
    data: result,
  });
});

export const goalController = {
  createGoal,
  getGoalList,
  getGoalById,
  updateGoal,
  deleteGoal,
};