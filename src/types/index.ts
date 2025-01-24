export interface RentalPeriod {
	startDate: string; 
	endDate: string;
	id: string;
	status: 'rented' | 'returned';
	returnedDate?: string;
}

export interface Item {
	id: string;
	name: string;
	description: string;
	price: number;
	availability: boolean;
	rentalPeriods?: RentalPeriod[];
}

export interface FilterQueryParams {
	name: string;
	minPrice: string;
	maxPrice: string;
}
export interface RentalQueryParams {
	id: string;
}
export interface ReturnQueryParams {
	id: string;
	rentalId: string;
}
