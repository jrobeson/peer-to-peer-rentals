import { Router, type Request, type Response } from 'express';
import { items, type Item, type QueryParams } from '../dataStore';

const router = Router();

// Search items
router.get('/items', async (req: Request<{}, {}, Item, QueryParams>, res: Response<Item | Item[] | { error: string }>) => {
	try {
		const { name, minPrice, maxPrice } = req.query;
		const nameFilter = name ? name.toString().toLowerCase() : undefined;
		const min = minPrice ? Number(minPrice) : undefined;
		const max = maxPrice ? Number(maxPrice) : undefined;
		const filteredItems = items.filter((item) => {
			const matchesName = nameFilter ? item.name.toLowerCase().includes(nameFilter) : true;
			const matchesMin = min !== undefined ? item.price >= min : true;
			const matchesMax = max !== undefined ? item.price <= max : true;
			return matchesName && matchesMin && matchesMax;
		});
		if (filteredItems.length === 0) {
			throw new Error('No items could be found matching your filters');
		}
		res.status(200).json(filteredItems);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unexpected error occured: ' + error });
		}
	}
});

// Rent an item
router.post('/items/:id/rent', async (req, res) => {
	res.send('Rent an item endpoint');
});

// Return an item
router.post('/items/:id/return', async (req, res) => {
	res.send('Return an item endpoint');
});

export default router;
