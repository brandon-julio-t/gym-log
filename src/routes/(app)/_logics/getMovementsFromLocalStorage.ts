import getMovementsFromLocalStorageInDateRange from '$lib/services/movements/getMovementsFromLocalStorageInDateRange';

export default function getMovementsFromLocalStorage() {
	const now = new Date();
	return getMovementsFromLocalStorageInDateRange(now, now);
}
