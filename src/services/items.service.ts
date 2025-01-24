import { items } from '../dataStore';
import { type Item, type RentalPeriod, type FilterQueryParams } from '../types';
import { doesOverlap } from '../utils/dateutils';
import { v4 as uuidv4 } from 'uuid';

export class ItemsService {
	static searchItems(query: FilterQueryParams): Item | Item[] {
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
			throw new Error('No items could be found matching your filters');
		}
		return filteredItems;
	}
	static rentItem(id: string, startDate: string, endDate: string): { item: Item; rentalId: string } {
		if (!startDate || !endDate) {
			throw new Error('Missing required fields (startDate, endDate)');
		}
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new Error('Invalid date format.');
		}
		if (start > end) {
			throw new Error('startDate cannot be after endDate');
		}
		const item: Item | undefined = items.find((item) => item.id === id);
		if (!item) {
			throw new Error('Item not found');
		}
		if (!item.rentalPeriods) {
			item.rentalPeriods = [];
		}
		const conflict = item.rentalPeriods.some((period) => {
			const existingStart = new Date(period.startDate);
			const existingEnd = new Date(period.endDate);
			return doesOverlap(start, end, existingStart, existingEnd);
		});
		if (conflict) {
			throw new Error('This item is already rented for the requested date range');
		}
		const rentalId = uuidv4();
		const newRental: RentalPeriod = {
			startDate,
			endDate,
			id: rentalId,
		};
		item.rentalPeriods.push(newRental);
		item.availability = false;
		return { item, rentalId };
	}

	static returnItem(id: string, rentalId: string): Item {
		const item = items.find((i) => i.id === id);
		if (!item) {
			throw new Error('Item not found.');
		}
		if (!item.rentalPeriods || item.rentalPeriods.length === 0) {
			throw new Error('No rental periods found for this item.');
		}
		const rental = item.rentalPeriods.find((r) => r.id === rentalId);
		if (!rental) {
			throw new Error('No matching rental period found with that ID.');
		}
		// Mark it available
		item.availability = true;
		// Optionally remove the last rental period or something else
		return item;
	}
}
