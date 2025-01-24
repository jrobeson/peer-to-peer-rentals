import { Router } from 'express';
import { searchItemsController, rentItemController, returnItemController, addItemController } from '../controllers/items.controller';

const router = Router();

router.get('/items', searchItemsController);

router.post('/items', addItemController);

router.post('/items/:id/rent', rentItemController);

router.post('/items/:id/return/:rentalId', returnItemController);

export default router;
