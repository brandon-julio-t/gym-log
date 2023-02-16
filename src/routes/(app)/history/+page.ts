import groupMovementsByBestMovement from '$lib/logics/movements/groupMovementsByBestMovement';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
import getMovementsForCurrentUserInDateRange from '$lib/services/movements/getMovementsForCurrentUserInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const { url } = event;

	const beginningOfTime = new Date(0);

	const allMovements = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		beginningOfTime,
		new Date()
	);
	
	const [groupedAllMovements, groupedAllMovementKeys] = groupMovementsByName(allMovements);
	const bestMovements = groupMovementsByBestMovement(groupedAllMovements, groupedAllMovementKeys);

	const allDates = [
		...new Set(
			allMovements
				.map((m) => m.created_at)
				.map((s) => new Date(s))
				.map((d) => d.toISOString())
				.map((d) => d.slice(0, 'yyyy-mm-dd'.length))
		)
	].sort();

	const [currentDate] = allDates.reverse();
	const filterDate = new Date(url.searchParams.get('date') ?? new Date(currentDate));

	const movementsInDateRange = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		filterDate,
		filterDate
	);

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(movementsInDateRange);

	return {
		movementsInDateRange,
		groupedMovements,
		groupedMovementKeys,
		bestMovements,
		allDates,
		currentDate
	};
}) satisfies PageLoad;
