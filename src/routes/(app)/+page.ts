import getMovementsForCurrentUserInDateRange from '$lib/services/movements/getMovementsForCurrentUserInDateRange';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const now = new Date();

	const movementsInDateRange = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		now,
		now
	);

	const allMovements = await getMovementsForCurrentUserInDateRange(
		supabaseClient,
		session,
		new Date(0),
		now
	);

	return {
		movementsInDateRange,
		allMovements
	};
}) satisfies PageLoad;
