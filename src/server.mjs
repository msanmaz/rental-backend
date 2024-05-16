import express from 'express';
import morgan from 'morgan';
import router from './router.mjs'
import { protect } from './modules/auth.mjs';
// Create an Express application
const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res) =>{
    console.log('hello')
    res.status(200)
    res.json({message:'hello'})
})

app.use('/api',protect,router)

export default app;
