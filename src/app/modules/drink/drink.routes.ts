import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { drinkController } from './drink.controller';
import { drinkValidation } from './drink.validation';

const router = express.Router();

router.post(
'/',
validateRequest(drinkValidation.createSchema),
auth(),
drinkController.createDrink,
);
router.get('/month-wise/:date', auth(), drinkController.getAllDrinkList);

router.get('/:date', auth(), drinkController.getDrinkList);


router.get('/:id', auth(), drinkController.getDrinkById);

router.put(
'/:id',
validateRequest(drinkValidation.updateSchema),
auth(),
drinkController.updateDrink,
);

router.delete('/:id', auth(), drinkController.deleteDrink);

export const drinkRoutes = router;