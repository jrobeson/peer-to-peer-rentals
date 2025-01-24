export interface RentalPeriod {
	startDate: string; // or Date, but we'll store as string for simplicity
	endDate: string;
	id: string;
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
