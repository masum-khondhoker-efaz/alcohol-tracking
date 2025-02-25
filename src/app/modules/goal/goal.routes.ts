import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { goalController } from './goal.controller';
import { goalValidation } from './goal.validation';

const router = express.Router();

router.post(
'/',
auth(),
goalController.createGoal,
);

router.get('/', auth(), goalController.getGoalList);

router.get('/:goalId', auth(), goalController.getGoalById);

router.put(
'/:goalId',
auth(),
goalController.updateGoal,
);

router.delete('/:goalId', auth(), goalController.deleteGoal);

export const goalRoutes = router;