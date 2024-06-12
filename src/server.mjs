import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getAllHouses, getHouseById } from './handlers/houseHandlers.mjs';
import authRouter from './api/auth.mjs';
import protectedHouseRouter from './api/protectedHouseRoute.mjs';
import publicHouseRouter from './api/publicHouseRoute.mjs';

const app = express();
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter); // Mounting auth routes
app.use('/api/protected', protectedHouseRouter); // Mounting protected house routes
app.use('/api/public', publicHouseRouter); // Mounting public house routes

app.get('/houses', getAllHouses); // Public route
app.get('/houses/:id', getHouseById); // Public route

export default app;