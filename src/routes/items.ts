import { Router } from 'express';
import { searchItemsController, rentItemController, returnItemController } from '../controllers/items.controller';

const router = Router();

// Search items
router.get('/items', searchItemsController);

// Rent an item
router.post('/items/:id/rent', rentItemController);

// Return an item
router.post('/items/:id/return/:rentalId', returnItemController);

export default router;
