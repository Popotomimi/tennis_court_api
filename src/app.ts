import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSetup } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

swaggerSetup(app);

app.use('/api', routes);

app.use(errorHandler);

export { app };
