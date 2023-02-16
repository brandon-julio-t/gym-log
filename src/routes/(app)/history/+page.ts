import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import {
	getMovementsFromLocalStorageInDateRange,
	getMovementsFromSupabaseInDateRange,
	groupMovementsByName
} from '$lib/movementsService';
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

	return {
		allMovements,
		groupedMovements,
		groupedMovementKeys
	};
}) satisfies PageLoad;
