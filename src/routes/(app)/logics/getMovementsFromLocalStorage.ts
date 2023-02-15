import type IMovementTransaction from '$lib/contracts/IMovementTransaction';

export default function getMovementsFromLocalStorage() {
	const start = new Date();
	start.setHours(0, 0, 0);

	const end = new Date();
	end.setHours(23, 59, 59);

	const previousMovements: IMovementTransaction[] = JSON.parse(
		localStorage.getItem('movements') ?? '[]'
	);

	const filteredMovements = previousMovements.filter((movement) => {
		const createdAt = new Date(movement.created_at);
		return start <= createdAt && createdAt <= end;
	});

	return filteredMovements;
}
