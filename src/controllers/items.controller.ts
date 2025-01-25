import { type NextFunction, type Request, type Response } from 'express';
import { ItemsService } from '../services/items.service';
import { type Item, type FilterQueryParams, type RentalQueryParams, type RentalPeriod, type ReturnQueryParams } from '../types';

export async function searchItemsController(req: Request<{}, {}, {}, FilterQueryParams>, res: Response, next: NextFunction) {
	try {
		const results = ItemsService.searchItems(req.query);
		res.status(200).json(results);
	} catch (error) {
		next(error);
	}
}

export async function addItemController(req: Request<{}, {}, Item>, res: Response, next: NextFunction) {
	try {
		let item = req.body;
		ItemsService.addItem(item);
		res.status(201).json({ message: 'Item added successfully!', item });
	} catch (error) {
		next(error);
	}
}

export async function rentItemController(req: Request<RentalQueryParams, {}, RentalPeriod>, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const { startDate, endDate } = req.body;
		const { item, rentalId } = ItemsService.rentItem(id, startDate, endDate);
		res.status(200).json({ message: 'Item rented successfully', item, id: rentalId });
	} catch (error) {
		next(error);
	}
}

export async function returnItemController(req: Request<ReturnQueryParams>, res: Response, next: NextFunction) {
	try {
		const { id, rentalId } = req.params;
		const returnedItem = ItemsService.returnItem(id, rentalId);
		res.status(200).json({
			message: 'Item returned successfully',
			item: returnedItem,
		});
	} catch (error) {
		next(error);
	}
}
