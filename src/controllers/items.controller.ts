import { type Request, type Response } from 'express';
import { ItemsService } from '../services/items.service';
import { type Item, type FilterQueryParams, type RentalQueryParams, type RentalPeriod, type ReturnQueryParams } from '../types';

export async function searchItemsController(req: Request<{}, {}, Item, FilterQueryParams>, res: Response) {
	try {
		const results = ItemsService.searchItems(req.query);
		res.status(200).json(results);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unexpected error occured: ' + error });
		}
	}
}

export async function rentItemController(req: Request<RentalQueryParams, {}, RentalPeriod>, res: Response) {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.body;
		const { item, rentalId } = ItemsService.rentItem(id, startDate, endDate);
		res.status(200).json({ message: 'Item rented successfully', item, id: rentalId });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unexpected error occured: ' + error });
		}
	}
}

export async function returnItemController(req: Request<ReturnQueryParams>, res: Response) {
	try {
		const { id, rentalId } = req.params;
		const returnedItem = ItemsService.returnItem(id, rentalId);
		res.status(200).json({
			message: 'Item returned successfully',
			item: returnedItem,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unexpected error occured: ' + error });
		}
	}
}
