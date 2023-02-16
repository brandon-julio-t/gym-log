import groupMovementsByBestMovement from '$lib/logics/movements/groupMovementsByBestMovement';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
import getMovementsForCurrentUserInDateRange from '$lib/services/movements/getMovementsForCurrentUserInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	const now = new Date();

	const allMovements = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		now,
		now
	);

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(allMovements);

	const bestMovements = groupMovementsByBestMovement(groupedMovements, groupedMovementKeys);

	return {
		allMovements,
		groupedMovements,
		groupedMovementKeys,
		bestMovements
	};
}) satisfies PageLoad;
