import type IMovementTransaction from "$lib/contracts/IMovementTransaction";

export default function groupMovementsByBestMovement(
	groupedMovements: Map<string, IMovementTransaction[]>,
	groupedMovementKeys: string[]
) {
	const bestMovements = new Map<string, IMovementTransaction>();

	groupedMovementKeys.forEach((key) => {
		const movements = groupedMovements.get(key);
		if (!movements) return;

		const bestWeight = Math.max(...movements.map((m) => m.weight));
		const bestReps = Math.max(
			...movements.filter((m) => m.weight === bestWeight).map((m) => m.reps)
		);

		const [bestMovement] = movements
			.filter((m) => m.weight === bestWeight)
			.filter((m) => m.reps === bestReps);

		bestMovements.set(key, bestMovement);
	});

	return bestMovements;
}
