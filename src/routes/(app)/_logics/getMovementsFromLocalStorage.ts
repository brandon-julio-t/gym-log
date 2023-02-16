import { getMovementsFromLocalStorageInDateRange } from '$lib/movementsService';

export default function getMovementsFromLocalStorage() {
	const now = new Date();
	return getMovementsFromLocalStorageInDateRange(now, now);
}
