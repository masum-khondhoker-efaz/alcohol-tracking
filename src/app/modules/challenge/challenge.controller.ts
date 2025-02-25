import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { challengeService } from './challenge.service';

const createChallenge = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await challengeService.createChallengeIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Challenge created successfully',
    data: result,
  });
});

const getChallengeList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await challengeService.getChallengeListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Challenge list retrieved successfully',
    data: result,
  });
});

const getChallengeById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await challengeService.getChallengeByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Challenge details retrieved successfully',
    data: result,
  });
});

const updateChallenge = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await challengeService.updateChallengeIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Challenge updated successfully',
    data: result,
  });
});

const deleteChallenge = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await challengeService.deleteChallengeItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Challenge deleted successfully',
    data: result,
  });
});

export const challengeController = {
  createChallenge,
  getChallengeList,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};