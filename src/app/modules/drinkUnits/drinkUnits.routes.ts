import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { drinkUnitsController } from './drinkUnits.controller';
import { drinkUnitsValidation } from './drinkUnits.validation';

const router = express.Router();

router.post(
'/',
validateRequest(drinkUnitsValidation.createSchema),
auth(),
drinkUnitsController.createDrinkUnits,
);

router.get('/', auth(), drinkUnitsController.getDrinkUnitsList);

router.get('/:id', auth(), drinkUnitsController.getDrinkUnitsById);

router.put(
'/:id',
validateRequest(drinkUnitsValidation.updateSchema),
auth(),
drinkUnitsController.updateDrinkUnits,
);

router.delete('/:id', auth(), drinkUnitsController.deleteDrinkUnits);

export const drinkUnitsRoutes = router;