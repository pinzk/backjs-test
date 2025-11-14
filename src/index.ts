import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
import errorMiddleware from './middlewares/error';
import { pool } from './config/database';


const PORT: number = Number(process.env.PORT) || 3001;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/api', router);
app.use(errorMiddleware);

const start = async (): Promise<void> => {
    try {
        pool.query('SELECT NOW()', (err, res) => {
            if(err) 
                console.error('Error connecting to the database', err.stack);
            else 
                console.log('Connected to the database:', res.rows);
        });
        
        app.listen(PORT, () => {
            console.log(`Server started on PORT = ${PORT}`);
        });
    } catch (e) {
        console.error("try/catch", "index", "start", e);
    }
}

start();