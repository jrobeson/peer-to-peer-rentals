export function doesOverlap(newStart: Date, newEnd: Date, existingStart: Date, existingEnd: Date): boolean {
	return newStart <= existingEnd && newEnd >= existingStart;
}
