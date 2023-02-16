import type IMovementTransaction from '$lib/contracts/IMovementTransaction';

export default function groupMovementsByName(
	movements: IMovementTransaction[]
): [Map<string, IMovementTransaction[]>, string[]] {
	const groupedMovements = new Map<string, IMovementTransaction[]>();

	movements.forEach((movement) => {
		const normalizedKey = movement.name.trim().toLowerCase();

		if (groupedMovements.has(normalizedKey)) {
			groupedMovements.get(normalizedKey)?.push(movement);
		} else {
			groupedMovements.set(normalizedKey, [movement]);
		}
	});

	const keys = [...groupedMovements.keys()];

	return [groupedMovements, keys];
}
