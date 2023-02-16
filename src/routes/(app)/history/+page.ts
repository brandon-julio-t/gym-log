import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
import getMovementsFromLocalStorageInDateRange from '$lib/services/movements/getMovementsFromLocalStorageInDateRange';
import getMovementsFromSupabaseInDateRange from '$lib/services/movements/getMovementsFromSupabaseInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const { url } = event;

	const startDate = new Date(url.searchParams.get('start') ?? new Date());
	const endDate = new Date(url.searchParams.get('end') ?? new Date());

	let allMovements: IMovementTransaction[] = [];

	if (session) {
		const { data, error } = await getMovementsFromSupabaseInDateRange(
			supabaseClient,
			session.user.id,
			startDate,
			endDate
		);

		if (error) throw error;

		allMovements = [...allMovements, ...data];
	}

	if (typeof localStorage !== 'undefined') {
		const movements = getMovementsFromLocalStorageInDateRange(startDate, endDate);
		allMovements = [...allMovements, ...movements];
	}

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(allMovements);

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

	return {
		allMovements,
		groupedMovements,
		groupedMovementKeys,
		bestMovements
	};
}) satisfies PageLoad;
