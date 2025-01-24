export function doesOverlap(newStart: Date, newEnd: Date, existingStart: Date, existingEnd: Date): boolean {
	return newStart <= existingEnd && newEnd >= existingStart;
}

export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
