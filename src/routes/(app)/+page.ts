import groupMovementsByBestMovement from '$lib/logics/movements/groupMovementsByBestMovement';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
import getMovementsForCurrentUserInDateRange from '$lib/services/movements/getMovementsForCurrentUserInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const beginningOfTime = new Date(0);
	const now = new Date();

	const allMovementsPromise = getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		beginningOfTime,
		now
	);
	const movementsInDateRange = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		now,
		now
	);

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(movementsInDateRange);

	const allMovements = await allMovementsPromise;
	const [groupedAllMovements, groupedAllMovementKeys] = groupMovementsByName(allMovements);
	const bestMovements = groupMovementsByBestMovement(groupedAllMovements, groupedAllMovementKeys);

	return {
		movementsInDateRange,
		groupedMovements,
		groupedMovementKeys,
		bestMovements
	};
}) satisfies PageLoad;
