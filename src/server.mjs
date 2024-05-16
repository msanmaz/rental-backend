import express from 'express';
import morgan from 'morgan';
import router from './router.mjs'
import cors from 'cors'
import { protect } from './modules/auth.mjs';
import { createAdmin, signin } from './handlers/user.mjs';
import { getAllHouses, getHouseById } from './handlers/houses.mjs';
import { param } from 'express-validator';
import { handleInputErrors } from './modules/middleware.mjs';

const app = express();


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',protect,router)
app.use('/houses',getAllHouses)
app.use('/houses/:id', getHouseById);
app.post('/createUser',createAdmin)
app.post('/signin',signin)

export default app;
