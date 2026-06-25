import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSetup } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

swaggerSetup(app);

app.use('/api', routes);

app.use(errorHandler);

export { app };
