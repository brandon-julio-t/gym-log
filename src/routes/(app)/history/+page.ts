import groupMovementsByBestMovement from '$lib/logics/movements/groupMovementsByBestMovement';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
import getMovementsForCurrentUserInDateRange from '$lib/services/movements/getMovementsForCurrentUserInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const { url } = event;

	const beginningOfTime = new Date(0);
	const startDate = new Date(url.searchParams.get('start') ?? new Date());
	const endDate = new Date(url.searchParams.get('end') ?? new Date());

	const allMovements = getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		beginningOfTime,
		endDate
	);

	const movementsInDateRange = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		startDate,
		endDate
	);

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(movementsInDateRange);

	const [groupedAllMovements, groupedAllMovementKeys] = groupMovementsByName(await allMovements);
	const bestMovements = groupMovementsByBestMovement(groupedAllMovements, groupedAllMovementKeys);

	return {
		movementsInDateRange,
		groupedMovements,
		groupedMovementKeys,
		bestMovements
	};
}) satisfies PageLoad;
