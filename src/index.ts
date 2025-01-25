import express, { type NextFunction, type Response, type Request } from 'express';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.routes';
import { HttpError } from './utils/error';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', itemRoutes);

app.use((error: unknown, _r: Request, res: Response, _n: NextFunction) => {
	if (error instanceof HttpError) {
		res.status(error.statusCode).json({ error: error.message });
	}
	res.status(500).json({ error: 'An unexpected error occurred! ' });
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
