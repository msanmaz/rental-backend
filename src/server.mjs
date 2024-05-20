import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import { createAdmin, login } from './handlers/user.mjs';
import { getAllHouses, getHouseById } from './handlers/houses.mjs';
import { protect } from './middleware/authMiddleware.mjs';
import authRouter from './api/auth.mjs';
import router from './api/protectedHouseRoute.mjs';


const app = express();
const corsOptions = {
    origin: 'http://localhost:3001', // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
  

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',protect,router)
app.use('/houses',getAllHouses)
app.use('/houses/:id', getHouseById);
app.use('/user',authRouter)


export default app;
