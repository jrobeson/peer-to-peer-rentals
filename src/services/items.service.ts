import { items } from '../dataStore';
import { type Item, type RentalPeriod, type FilterQueryParams } from '../types';
import { doesOverlap, formatDate } from '../utils/dateutils';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../utils/error';

export class ItemsService {
	static addItem(newItem: Item): Item {
		if (!newItem.id || !newItem.name || !newItem.price || !newItem.description) {
			throw new HttpError('Missing a required field! Must incldue id, name, and price', 400);
		}
		const existingId = items.find((item) => item.id === newItem.id)?.id;
		if (existingId) {
			throw new HttpError('That item already exists!', 409);
		}
		newItem.availability = true;
		newItem.rentalPeriods = [];
		items.push(newItem);
		return newItem;
	}

	static searchItems(query: FilterQueryParams): Item[] {
		const { name, minPrice, maxPrice } = query;
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
			throw new HttpError('No items could be found matching your filters', 404);
		}
		return filteredItems;
	}

	static rentItem(id: string, startDate: string, endDate: string): { item: Item; rentalId: string } {
		if (!startDate || !endDate) {
			throw new HttpError('Missing required fields (startDate, endDate)', 400);
		}
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new HttpError('Invalid date format.', 400);
		}
		if (start > end) {
			throw new HttpError('startDate cannot be after endDate', 409);
		}
		const item: Item | undefined = items.find((item) => item.id === id);
		if (!item) {
			throw new HttpError('Item not found', 404);
		}
		if (!item.rentalPeriods) {
			item.rentalPeriods = [];
		}
		const conflict = item.rentalPeriods.some((period) => {
			const existingStart = new Date(period.startDate);
			const existingEnd = new Date(period.endDate);
			return period.status === 'rented' && doesOverlap(start, end, existingStart, existingEnd);
		});
		if (conflict) {
			throw new HttpError('This item is already rented for the requested date range', 409);
		}
		const rentalId = uuidv4();
		const newRental: RentalPeriod = {
			startDate,
			endDate,
			id: rentalId,
			status: 'rented',
		};
		item.rentalPeriods.push(newRental);
		item.availability = false;
		return { item, rentalId };
	}

	static returnItem(id: string, rentalId: string): Item {
		const item = items.find((i) => i.id === id);
		if (!item) {
			throw new HttpError('Item not found.', 404);
		}
		if (!item.rentalPeriods || item.rentalPeriods.length === 0) {
			throw new HttpError('No rental periods found for this item.', 404);
		}
		const rental = item.rentalPeriods.find((r) => r.id === rentalId);
		if (!rental) {
			throw new HttpError('No matching rental period found with that ID.', 404);
		}
		rental.status = 'returned';
		rental.returnedDate = formatDate(new Date());
		item.availability = true;
		return item;
	}
}
