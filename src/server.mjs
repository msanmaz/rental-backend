import express from 'express';
import morgan from 'morgan';
import router from './router.mjs'
import cors from 'cors'
import { protect } from './modules/auth.mjs';
import { createAdmin, signin } from './handlers/user.mjs';
import { getHouses } from './handlers/houses.mjs';
// Create an Express application
const app = express();


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',protect,router)
app.use('/houses',getHouses)
app.post('/createUser',createAdmin)
app.post('/signin',signin)

export default app;
