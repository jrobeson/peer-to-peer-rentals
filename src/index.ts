import express from 'express';
import dotenv from 'dotenv';
import itemRoutes from './routes/items';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// API Routes
app.use('/api', itemRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

