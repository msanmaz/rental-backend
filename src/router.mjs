import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from './modules/middleware.mjs'
import { addProperty, getCityIdByName, getPropertyTypeByName } from './modules/prisma.mjs'
const router = Router()



router.get('/houses/:id', () => { })
router.put('/houses/:id', body("id").isInt(), handleInputErrors, (req, res) => {

})



router.post('/houses', [
    body('title').notEmpty().withMessage('Title is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('cityName').notEmpty().withMessage('City name is required'),
    body('propertyType').isString().withMessage('Valid property type ID is required'),
    body('rooms').isInt().withMessage('Number of rooms must be an integer'),
    body('bathrooms').isInt().withMessage('Number of bathrooms must be an integer'),
    body('rentalDetail').optional().isObject().withMessage('Rental Detail must be a valid object'),
    body('saleDetail').optional().isObject().withMessage('Sale Detail must be a valid object'),
    handleInputErrors
], async (req, res) => {
    try {
        const { title, description, address, cityName, propertyType, rooms, bathrooms, amenities, rentalDetail, saleDetail } = req.body;
        const cityId = await getCityIdByName(cityName);
        const propertyTypeId = await getPropertyTypeByName(propertyType);
        if (!cityId) {
            return res.status(400).json({ error: 'City name does not exist' });
        }
        const propertyData = {
            title,
            description,
            address,
            cityId,
            propertyTypeId,
            rooms,
            bathrooms,
            amenities,
            rentalDetail: rentalDetail ? { create: rentalDetail } : undefined,
            saleDetail: saleDetail ? { create: saleDetail } : undefined
        };

        const property = await addProperty(propertyData);
        res.json(property);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.delete('/houses/:id', () => { })


export default router