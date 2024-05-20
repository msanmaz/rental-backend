import { Router } from 'express';
import { param } from 'express-validator';
import { handleInputErrors } from '../middleware/inputMiddleware.mjs';
import { getHouseById,getAllHouses } from '../handlers/houses.mjs';

const publichouseRouter = Router();

// Fetch a single house by ID
publichouseRouter.get('/houses/:id', param('id').isInt().withMessage('ID must be an integer'), handleInputErrors, getHouseById);
publichouseRouter.get('/houses', getAllHouses);



export default publichouseRouter;