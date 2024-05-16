import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from './modules/middleware.mjs';
import { getHouseById, updateHouse, addHouse, deleteHouse } from './handlers/houses.mjs';

const router = Router();

// Fetch a single house by ID
router.get('/houses/:id', param('id').isInt().withMessage('ID must be an integer'), handleInputErrors, getHouseById);

// Update a house by ID
router.put(
  '/houses/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('address').optional().isString().withMessage('Address must be a string'),
    body('cityName').optional().isString().withMessage('City name must be a string'),
    body('propertyType').optional().isString().withMessage('Property type must be a string'),
    body('rooms').optional().isInt().withMessage('Number of rooms must be an integer'),
    body('bathrooms').optional().isInt().withMessage('Number of bathrooms must be an integer'),
    body('rentalDetail').optional().isObject().withMessage('Rental Detail must be a valid object'),
    body('saleDetail').optional().isObject().withMessage('Sale Detail must be a valid object'),
    handleInputErrors,
  ],
  updateHouse
);

// Add a new house
router.post(
  '/houses',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('cityName').notEmpty().withMessage('City name is required'),
    body('propertyType').isString().withMessage('Property type is required'),
    body('rooms').isInt().withMessage('Number of rooms must be an integer'),
    body('bathrooms').isInt().withMessage('Number of bathrooms must be an integer'),
    body('rentalDetail').optional().isObject().withMessage('Rental Detail must be a valid object'),
    body('saleDetail').optional().isObject().withMessage('Sale Detail must be a valid object'),
    handleInputErrors,
  ],
  addHouse
);

// Delete a house by ID
router.delete('/houses/:id', param('id').isInt().withMessage('ID must be an integer'), handleInputErrors, deleteHouse);

export default router;