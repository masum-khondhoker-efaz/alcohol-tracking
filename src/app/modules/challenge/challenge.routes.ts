import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { challengeController } from './challenge.controller';
import { challengeValidation } from './challenge.validation';

const router = express.Router();

router.post(
'/',
validateRequest(challengeValidation.createSchema),
auth(),
challengeController.createChallenge,
);

router.get('/', auth(), challengeController.getChallengeList);

router.get('/:id', auth(), challengeController.getChallengeById);

router.put(
'/:id',
validateRequest(challengeValidation.updateSchema),
auth(),
challengeController.updateChallenge,
);

router.delete('/:id', auth(), challengeController.deleteChallenge);

export const challengeRoutes = router;