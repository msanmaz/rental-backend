import {Router} from 'express'

const router = Router()


router.get('/houses', (req,res) => {
    res.status(200)
    res.json({success:'houseRoute!!'})
})
router.get('/houses/:id', () => {})
router.put('/houses/:id', () => {})
router.post('/houses', () => {})
router.delete('/houses/:id', () => {})


export default router