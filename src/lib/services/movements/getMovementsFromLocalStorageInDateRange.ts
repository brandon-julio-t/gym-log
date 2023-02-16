import { MOVEMENTS_ENTITY_NAME } from "$lib/constants";
import type IMovementTransaction from "$lib/contracts/IMovementTransaction";

export default function getMovementsFromLocalStorageInDateRange(startDate: Date, endDate: Date) {
	const start = new Date(startDate);
	start.setHours(0, 0, 0);

	const end = new Date(endDate);
	end.setHours(23, 59, 59);

	const movements: IMovementTransaction[] = JSON.parse(
		localStorage.getItem(MOVEMENTS_ENTITY_NAME) ?? '[]'
	);

	return movements.filter((movement) => {
		const createdAt = new Date(movement.created_at);
		return start <= createdAt && createdAt <= end;
	});
}